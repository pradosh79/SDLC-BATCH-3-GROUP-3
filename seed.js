const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://earthpradosh:TbSO5iW0LSoEgxu1@cluster0.okrttmy.mongodb.net/elarning"
);

const ObjectId = mongoose.Types.ObjectId;

async function seed() {

  // ⚠️ REMOVE in production
  await mongoose.connection.dropDatabase();

  /* ---------------- USER ---------------- */
  const userId = new ObjectId();

  await mongoose.connection.collection("users").insertOne({
    _id: userId,
    name: "Demo User",
    email: "demo@test.com",
    role: "student",
    createdAt: new Date()
  });

  /* ---------------- COURSES ---------------- */
  const courses = [
    {
      _id: new ObjectId(),
      title: "UI/UX Design",
      thumbnail: "uiux.png",
      category: "IT"
    },
    {
      _id: new ObjectId(),
      title: "Web Development",
      thumbnail: "web.png",
      category: "IT"
    },
    {
      _id: new ObjectId(),
      title: "Digital Marketing",
      thumbnail: "marketing.png",
      category: "Non-IT"
    }
  ];

  await mongoose.connection.collection("courses").insertMany(courses);

  /* ---------------- ENROLLMENTS ---------------- */
  await mongoose.connection.collection("enrollments").insertMany([
    {
      user: userId,
      course: courses[0]._id,
      progress: 65,
      completed: false,
      lastAccessed: new Date()
    },
    {
      user: userId,
      course: courses[1]._id,
      progress: 45,
      completed: false,
      lastAccessed: new Date()
    },
    {
      user: userId,
      course: courses[2]._id,
      progress: 100,
      completed: true,
      lastAccessed: new Date()
    }
  ]);

  /* ---------------- LESSONS ---------------- */
  const lessons = [
    {
      _id: new ObjectId(),
      title: "Advanced Prototyping",
      course: courses[0]._id,
      order: 1,
      isPublished: true
    },
    {
      _id: new ObjectId(),
      title: "SEO Fundamentals",
      course: courses[2]._id,
      order: 2,
      isPublished: true
    }
  ];

  await mongoose.connection.collection("lesson").insertMany(lessons);

  /* ---------------- LESSON PROGRESS ---------------- */
  await mongoose.connection.collection("lessonprogresses").insertMany([
    {
      user: userId,
      lesson: lessons[0]._id,
      completed: true,
      watchTime: 120,
      updatedAt: new Date()
    },
    {
      user: userId,
      lesson: lessons[1]._id,
      completed: false,
      watchTime: 180,
      updatedAt: new Date()
    }
  ]);

  /* ---------------- ACTIVITIES ---------------- */
  await mongoose.connection.collection("activitylogs").insertMany([
    {
      user: userId,
      type: "course",
      message: 'Completed "Responsive Design"',
      createdAt: new Date()
    },
    {
      user: userId,
      type: "quiz",
      message: 'Passed "Javascript Quiz"',
      createdAt: new Date()
    }
  ]);

  console.log("✅ Dummy data inserted!");
  process.exit();
}

seed();
