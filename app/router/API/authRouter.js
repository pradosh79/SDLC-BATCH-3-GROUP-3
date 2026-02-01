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
const Dashboard = require("../../controller/API/dashboardApiController");




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
router.get("/courses/popular", course.getPopularCourses);
router.get("/courses/best-selling", course.getBestSellingCourses);
router.get("/courses/allCategories",course.getCategories);
router.get("/courses/studentView",course.homePageStudentViewCourses);
router.get("/courses/getTrustedBy", course.getTrustedBy);
router.get("/courses/testimonials", course.getTestimonials);

router.get("/courses/summary", AuthCheck, course.getAssignmentSummary);
router.get("/courses/current", AuthCheck, course.getCurrentAssignments);
router.post("/courses/:assignmentId/submit", AuthCheck, course.submitAssignment);
router.get("/courses/search", AuthCheck, course.searchAssignments);
router.get("/courses/upcoming", AuthCheck, course.getUpcomingAssignments);
router.get("/courses/assignment/past", AuthCheck, course.getPastAssignments);
router.get("/courses/:id", course.getCourseById);
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


//Dashboard
router.get("/overview",AuthCheck, Dashboard.getOverview);
router.get("/progress", AuthCheck, Dashboard.getProgress);
router.get("/activity", AuthCheck, Dashboard.getActivity);
router.get("/study-stats",AuthCheck, Dashboard.getStudyStats);
router.get("/gauge", AuthCheck, Dashboard.getGauge);
router.get("/mentors", AuthCheck, Dashboard.getMentors);
router.get("/notifications", AuthCheck, Dashboard.getNotifications);
router.get("/dashboard/progress", AuthCheck, Dashboard.dashboardProgress);
router.get("/student/course-dashboard/:id", AuthCheck, Dashboard.courseDashboard);



module.exports = router;


