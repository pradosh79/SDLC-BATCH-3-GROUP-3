const express = require('express');
const authController = require('../../controller/API/authController');
const course = require("../../controller/API/courseApiController");
const lesson = require("../../controller/API/lessonApiController");
const quiz = require("../../controller/API/quizApiController");
const progress = require("../../controller/API/progressApiController");
const enroll = require("../../controller/API/enrollApiController");
const rating = require("../../controller/API/ratingApiController");
const teacher = require("../../controller/API/teacherDashboardController");
const student = require("../../controller/API/studentDashboardController");

const AuthCheck = require('../../middleware/authCheck');

const router = express.Router();

//auth
router.post('/register',authController.Register)
router.post('/login',authController.Login)
router.get('/dashboard',AuthCheck,authController.Dashboard)
//course
router.get("/courses", course.getAllCourses);
router.get("/courses/search", course.searchCourses);
router.get("/courses/:id", course.getCourseDetails);
//lesson
router.get("/lessons/course/:courseId", lesson.getLessonsByCourse);
//quiz
router.get("/quiz/lesson/:lessonId", quiz.getQuizByLesson);
router.post("/quiz/submit", quiz.submitQuiz);
//progress
router.get("/progress", AuthCheck, progress.getUserProgress);
router.post("/progress/update", AuthCheck, progress.updateProgress);
//enroll
router.post("/enroll", AuthCheck, enroll.enrollCourse);
router.get("/enroll", AuthCheck, enroll.myCourses);
//rating
router.post("/rating", AuthCheck, rating.rateCourse);
//teacher
router.get("/teacher/dashboard", AuthCheck, teacher.dashboard);
//student
router.get("/student/dashboard", AuthCheck, student.dashboard);

module.exports = router;


