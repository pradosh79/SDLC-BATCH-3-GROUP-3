const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // fallback if needed

mongoose.connect("mongodb+srv://earthpradosh:TbSO5iW0LSoEgxu1@cluster0.okrttmy.mongodb.net/elearning");

const ObjectId = mongoose.Types.ObjectId;

/* ---------------------------------
   PASSWORD HASH FUNCTION
--------------------------------- */
async function hashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

function rand(n = 10) {
  return Math.floor(Math.random() * n);
}

async function seed() {
  await mongoose.connection.dropDatabase();

  /* ===================== USERS ===================== */
  const users = [];

  // 🔐 Admin
  users.push({
    _id: new ObjectId(),
    role: "admin",
    firstName: "Pradosh",
    lastName: "Mukherjee",
    email: "pradoshbig0@gmail.com",
    phone: "9999999999",
    password: await hashedPassword("123456"),
    subjectTaught: null,
    institution: null,
    yearsOfExperience: 0
  });

  // 👩‍🎓 Students & 👨‍🏫 Teachers
  for (let i = 1; i <= 19; i++) {
    const isTeacher = i % 3 === 0;

    users.push({
      _id: new ObjectId(),
      role: isTeacher ? "teacher" : "student",
      firstName: `User${i}`,
      lastName: "Demo",
      email: `user${i}@mail.com`,
      phone: `90000000${i}`,
      password: await hashedPassword("123456"),
      subjectTaught: isTeacher ? "Web Development" : null,
      institution: isTeacher ? "Demo Institute" : null,
      yearsOfExperience: isTeacher ? rand(10) + 1 : 0
    });
  }

  await mongoose.connection.collection("users").insertMany(users);

  const students = users.filter(u => u.role === "student");
  const teachers = users.filter(u => u.role === "teacher");

  /* ===================== CATEGORIES ===================== */
  const categories = [];
  for (let i = 1; i <= 20; i++) {
    categories.push({
      _id: new ObjectId(),
      name: `Category ${i}`
    });
  }
  await mongoose.connection.collection("categories").insertMany(categories);

  /* ===================== COURSES ===================== */
  const courses = [];
  for (let i = 1; i <= 20; i++) {
    courses.push({
      _id: new ObjectId(),
      title: `Course ${i}`,
      description: "Demo course description",
      teacher: teachers[rand(teachers.length)]._id,
      category: categories[rand(categories.length)]._id,
      price: rand(5000),
      createdAt: new Date()
    });
  }
  await mongoose.connection.collection("courses").insertMany(courses);

  /* ===================== LESSONS ===================== */
  const lessons = [];
  for (let i = 1; i <= 20; i++) {
    lessons.push({
      _id: new ObjectId(),
      title: `Lesson ${i}`,
      course: courses[rand(courses.length)]._id,
      order: i,
      isPublished: true
    });
  }
  await mongoose.connection.collection("lessons").insertMany(lessons);

  /* ===================== ENROLLMENTS ===================== */
  const enrollments = [];
  for (let i = 0; i < 20; i++) {
    enrollments.push({
      user: students[rand(students.length)]._id,
      course: courses[rand(courses.length)]._id,
      progress: rand(100),
      completed: Math.random() > 0.7
    });
  }
  await mongoose.connection.collection("enrollments").insertMany(enrollments);

  /* ===================== PROGRESS ===================== */
  const progress = [];
  for (let i = 0; i < 20; i++) {
    progress.push({
      user: students[rand(students.length)]._id,
      lesson: lessons[rand(lessons.length)]._id,
      completed: Math.random() > 0.5,
      watchTime: rand(300),
      updatedAt: new Date()
    });
  }
  await mongoose.connection.collection("progress").insertMany(progress);

  /* ===================== ACTIVITY ===================== */
  const activities = [];
  for (let i = 1; i <= 20; i++) {
    activities.push({
      user: students[rand(students.length)]._id,
      action: "lesson_completed",
      description: `Completed Lesson ${i}`,
      createdAt: new Date()
    });
  }
  await mongoose.connection.collection("activities").insertMany(activities);

  /* ===================== SIMPLE TABLES ===================== */
  const simpleSeed = async (name) => {
    const data = [];
    for (let i = 1; i <= 20; i++) {
      data.push({ title: `${name} ${i}`, createdAt: new Date() });
    }
    await mongoose.connection.collection(name).insertMany(data);
  };

  await simpleSeed("about");
  await simpleSeed("testimonials");
  await simpleSeed("trusted_by");
  await simpleSeed("notifications");
  await simpleSeed("otps");
  await simpleSeed("contacts");
  await simpleSeed("contact_info");
  await simpleSeed("assignments");
  await simpleSeed("quizzes");
  await simpleSeed("ratings");
  await simpleSeed("submissions");
  await simpleSeed("wishlists");

  console.log("✅ Database seeded successfully");
  process.exit();
}

seed();
