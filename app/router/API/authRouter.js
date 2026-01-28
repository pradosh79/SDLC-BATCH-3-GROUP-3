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
const wishlist = require("../../controller/API/wishlistApiController");
const about = require("../../controller/API/aboutApiController");
const contact = require("../../controller/API/contactApiController");
const ContactInfo=require("../../controller/API/contactInfoApiController");

const AuthCheck = require('../../middleware/authCheck');

const router = express.Router();

//auth
router.post('/register',authController.Register)
router.post('/login',authController.Login)
router.post('/verify-email', authController.VerifyEmail)
router.post('/reset-password-link', authController.resetPasswordLink);
router.post('/reset-password/:id/:token', authController.resetPassword);

//auth protected route
router.post('/update-password', AuthCheck, authController.updatePassword)
router.get('/dashboard', AuthCheck, authController.Dashboard)

//course
router.get("/courses", course.getAllCourses);
router.get("/courses/search", course.searchCourses);
router.get("/courses/category/:name", course.getByCategory);
router.get("/courses/:id", course.getCourseDetails);


//lesson
router.get("/lessons/course/:courseId", lesson.getLessonsByCourse);
//quiz
router.get("/quiz/lesson/:lessonId", quiz.getQuizByLesson);
router.post("/quiz/submit", quiz.submitQuiz);
//progress
router.post("/lesson-complete", AuthCheck, progress.markCompleted);
router.post("/quiz-score", AuthCheck, progress.saveQuizScore);
router.get("/course/:courseId", AuthCheck, progress.courseProgress);
//enroll
router.post("/enroll", AuthCheck, enroll.enrollCourse);
router.get("/enroll", AuthCheck, enroll.myCourses);
//rating
router.post("/rating", AuthCheck, rating.submit);
//teacher
router.get("/teacher/dashboard", AuthCheck, teacher.dashboard);
//student
router.get("/student/dashboard", AuthCheck, student.dashboard);

//wishlist
router.post("/toggle", AuthCheck, wishlist.toggle);
router.get("/list", AuthCheck, wishlist.list);

//about
router.get("/about", about.list);

//contact
router.get("/contact", contact.createContact);
//ContactInfo
router.get("/contactInfo", ContactInfo.getContactInfo);

module.exports = router;


