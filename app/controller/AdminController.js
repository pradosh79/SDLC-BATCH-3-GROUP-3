const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Course = require("../model/courseModel");
const Progress = require("../model/progressModel");
const Enrollment = require("../model/enrollmentModel");

class AdminController {

  async dashboard(req, res) {
  try {

    // 🔢 Analytics counts (YOUR EXISTING CODE)
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalCourses  = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    const completedLessons = await Progress.countDocuments({ completed: true });

    // ===============================
    // 📊 BAR CHART: Students vs Teachers
    // ===============================
    const userChart = {
      students: totalStudents,
      teachers: totalTeachers
    };

    // ===============================
    // 📈 LINE CHART: Monthly Enrollments
    // ===============================
    const enrollmentStats = await Enrollment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const enrollmentChart = {
      labels: enrollmentStats.map(
        item => `${item._id.month}/${item._id.year}`
      ),
      data: enrollmentStats.map(item => item.total)
    };

    // ===============================
    // 🎯 RENDER DASHBOARD
    // ===============================
    res.render("admin/dashboard", {
      admin: req.user,

      // cards
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments,
        completedLessons
      },

      // charts
      userChart,
      enrollmentChart
    });

  } catch (error) {
    console.log("Dashboard error:", error);
    res.status(500).send("Dashboard error");
  }
}


  async login(req, res) {
    try {
      res.render("admin/adminLogin", {});
    } catch (error) {
      console.log(error);
    }
  }

  async loginCreate(req, res) {
    try {
      const { email, password } = req.body;

      if (!(email && password)) {
        return res.redirect("/admin");
      }

      const user = await User.findOne({ email });

      if (
        user &&
        user.role === "admin" &&
        (await bcrypt.compare(password, user.password))
      ) {

        const tokendata = jwt.sign(
          {
            user_id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          },
          process.env.JWT_SECRET_ADMIN,
          { expiresIn: "8h" }
        );

        res.cookie("adminToken", tokendata);
        return res.redirect("/admin/dashboard");
      }

      return res.redirect("/admin");

    } catch (err) {
      console.log(err);
    }
  }

  /* =====================
     ADMIN PROFILE
  ===================== */
  async profile(req, res) {
    try {
      const admin = await User.findById(req.user._id);

      res.render("admin/profile/index", {
        admin
      });
    } catch (error) {
      console.log(error);
    }
  }

  /* =====================
     UPDATE PROFILE
  ===================== */
  async updateProfile(req, res) {
  try {
    console.log("PROFILE UPDATE BODY:", req.body);

    const { firstName, lastName, email, phone } = req.body;

    await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email, phone },
      { runValidators: true }
    );

    res.redirect("/admin/profile");

  } catch (error) {
    console.log("Profile update error:", error);
  }
}

  /* =====================
     LOGOUT
  ===================== */
  async adminLogout(req, res) {
    try {
      res.clearCookie("adminToken");

      req.session?.destroy(() => {
        return res.redirect("/admin");
      });

    } catch (error) {
      console.log(error);
    }
  }

  // ================= USERS LIST =================
  async users(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;

      const aggregate = User.aggregate([
        { $sort: { createdAt: -1 } }
      ]);

      const result = await User.aggregatePaginate(aggregate, { page, limit });

      return res.render("admin/users/index", {
        title: "Users List",
        admin: req.user,
        users: result.docs,
        pagination: result
      });

    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }

  // ================= CREATE FORM =================
  async userCreateForm(req, res) {
    try {
      res.render("admin/users/create", {
        title: "Add User",
        admin: req.user
      });
    } catch (error) {
      console.log(error);
    }
  }

  // ================= CREATE USER =================
  async userCreate(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        subjectTaught,
        institution,
        yearsOfExperience
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        firstName,
        lastName,
        email,
        phone,
        role,
        password: hashedPassword,

        isStudent: role === "student",
        isTeacher: role === "teacher",

        subjectTaught: role === "teacher" ? subjectTaught : undefined,
        institution: role === "teacher" ? institution : undefined,
        yearsOfExperience: role === "teacher" ? yearsOfExperience : undefined
      });

      return res.redirect("/admin/users");

    } catch (error) {
      console.log(error);
      res.status(500).send("Create user failed");
    }
  }

  // ================= EDIT FORM =================
  async userEditForm(req, res) {
    try {
      const user = await User.findById(req.params.id);

      res.render("admin/users/edit", {
        title: "Edit User",
        admin: req.user,
        user
      });

    } catch (error) {
      console.log(error);
      res.status(500).send("Edit page load failed");
    }
  }

  // ================= UPDATE USER =================
  async userUpdate(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        role,
        subjectTaught,
        institution,
        yearsOfExperience
      } = req.body;

      await User.findByIdAndUpdate(req.params.id, {
        firstName,
        lastName,
        email,
        phone,
        role,
        isStudent: role === "student",
        isTeacher: role === "teacher",
        subjectTaught: role === "teacher" ? subjectTaught : undefined,
        institution: role === "teacher" ? institution : undefined,
        yearsOfExperience: role === "teacher" ? yearsOfExperience : undefined
      });

      res.redirect("/admin/users");

    } catch (error) {
      console.log(error);
      res.status(500).send("Update failed");
    }
  }

  // ================= DELETE USER =================
  async userDelete(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/admin/users");
    } catch (error) {
      console.log(error);
      res.status(500).send("Delete error");
    }
  }
}

module.exports = new AdminController();
