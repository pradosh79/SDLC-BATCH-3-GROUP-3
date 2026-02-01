const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* ================= CONNECT ================= */
mongoose.connect("mongodb+srv://earthpradosh:TbSO5iW0LSoEgxu1@cluster0.okrttmy.mongodb.net/elearning");

/* ================= MODELS ================= */
const User = require("./app/model/userModel");
const Category = require("./app/model/categoryModel");
const Course = require("./app/model/courseModel");
const Lesson = require("./app/model/lessonModel");
const Enrollment = require("./app/model/enrollmentModel");
const Progress = require("./app/model/progressModel");
const Activity = require("./app/model/activityModel");
const Assignment = require("./app/model/assignment");
const Submission = require("./app/model/submission");
const Rating = require("./app/model/ratingModel");
const Notification = require("./app/model/notificationModel");
const About = require("./app/model/aboutModel");
const Testimonial = require("./app/model/testimonialModel");
const TrustedBy = require("./app/model/trustedByModel");
const ContactInfo = require("./app/model/contactInfoModel");
const Contact = require("./app/model/contactModel");
const Wishlist = require("./app/model/wishlistModel");
const Otp = require("./app/model/otpModel");

/* ================= HELPERS ================= */
const hash = async (p) => bcrypt.hash(p, 10);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const slugify = (s) =>
  s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

async function seed() {
  try {

    /* ================= PASSWORDS ================= */
    const adminPass = await hash("123456");
    const teacherPass = await hash("123456");
    const studentPass = await hash("123456");

    /* ================= USERS ================= */
    const admin = await User.create({
      role: "admin",
      firstName: "Pradosh",
      lastName: "Mukherjee",
      email: "pradoshbig0@gmail.com",
      phone: "9999999999",
      password: adminPass,
      isVerified: true
    });

    const teachers = await User.insertMany([
      {
        role: "teacher",
        isTeacher: true,
        firstName: "John",
        lastName: "Doe",
        email: "john@teacher.com",
        phone: "8881112222",
        password: teacherPass,
        subjectTaught: "Web Development",
        institution: "Tech University",
        yearsOfExperience: 8
      },
      {
        role: "teacher",
        isTeacher: true,
        firstName: "Sarah",
        lastName: "Lee",
        email: "sarah@teacher.com",
        phone: "8883334444",
        password: teacherPass,
        subjectTaught: "UI/UX Design",
        institution: "Design Academy",
        yearsOfExperience: 6
      }
    ]);

    const students = await User.insertMany(
      Array.from({ length: 12 }).map((_, i) => ({
        role: "student",
        isStudent: true,
        firstName: `Student${i + 1}`,
        lastName: "User",
        email: `student${i + 1}@mail.com`,
        phone: `90000000${i}`,
        password: studentPass,
        isVerified: true
      }))
    );

    /* ================= CATEGORIES (FIXED) ================= */
    const categoryNames = [
      "Web Development",
      "UI UX Design",
      "React",
      "Backend",
      "Marketing",
      "Data Science"
    ];

    const categories = await Category.insertMany(
      categoryNames.map(name => ({
        name,
        slug: slugify(name), // 🔥 FIX
        description: `${name} related courses`,
        icon: "📘",
        isActive: true
      }))
    );

    /* ================= COURSES ================= */
    const courses = await Course.insertMany([
      {
        title: "React Masterclass",
        shortDescription: "Learn React from scratch",
        longDescription: "Hooks, Router, State Management",
        teacher: teachers[0]._id,
        category: categories[2]._id,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        previewVideo: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        level: "Beginner",
        tags: ["react", "frontend"],
        totalLessons: 3,
        totalDuration: "3h 40m",
        isPopular: true
      },
      {
        title: "UI UX Design Bootcamp",
        shortDescription: "Design modern user interfaces",
        longDescription: "Figma, wireframes, design systems",
        teacher: teachers[1]._id,
        category: categories[1]._id,
        thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
        previewVideo: "https://www.youtube.com/watch?v=Y6Q7h2B3KkQ",
        level: "Intermediate",
        tags: ["design", "uiux"],
        totalLessons: 3,
        totalDuration: "2h 50m",
        isBestSeller: true
      }
    ]);

    /* ================= LESSONS ================= */
    const yt = [
      "https://www.youtube.com/watch?v=bMknfKXIFA8",
      "https://www.youtube.com/watch?v=SqcY0GlETPk",
      "https://www.youtube.com/watch?v=w7ejDZ8SWv8"
    ];

    const lessons = [];
    courses.forEach(c => {
      yt.forEach((url, i) => {
        lessons.push({
          course: c._id,
          title: `${c.title} - Lesson ${i + 1}`,
          videoUrl: url,
          duration: "45m",
          order: i + 1
        });
      });
    });
    const lessonDocs = await Lesson.insertMany(lessons);

    /* ================= ENROLLMENTS ================= */
    await Enrollment.insertMany(
      students.map(s => ({
        user: s._id,
        course: rand(courses)._id
      }))
    );

    /* ================= PROGRESS ================= */
    await Progress.insertMany(
      lessonDocs.map(l => ({
        user: rand(students)._id,
        course: l.course,
        lesson: l._id,
        completed: Math.random() > 0.5,
        quizScore: Math.floor(Math.random() * 100)
      }))
    );

    /* ================= ACTIVITY ================= */
    await Activity.insertMany(
      Array.from({ length: 20 }).map(() => ({
        user: rand(students)._id,
        date: new Date(),
        minutesSpent: Math.floor(Math.random() * 90)
      }))
    );

    /* ================= RATINGS ================= */
    await Rating.insertMany(
      Array.from({ length: 20 }).map(() => ({
        user: rand(students)._id,
        course: rand(courses)._id,
        rating: Math.floor(Math.random() * 5) + 1,
        review: "Excellent course!"
      }))
    );

    /* ================= TRUSTED BY (FIXED) ================= */
    await TrustedBy.insertMany([
      {
        companyName: "Google",
        logo: "https://logo.clearbit.com/google.com",
        website: "https://google.com",
        position: 1
      },
      {
        companyName: "Microsoft",
        logo: "https://logo.clearbit.com/microsoft.com",
        website: "https://microsoft.com",
        position: 2
      },
      {
        companyName: "Amazon",
        logo: "https://logo.clearbit.com/amazon.com",
        website: "https://amazon.com",
        position: 3
      }
    ]);

    console.log("✅ DATABASE SEEDED WITHOUT ERRORS");
    process.exit();

  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
}

seed();
