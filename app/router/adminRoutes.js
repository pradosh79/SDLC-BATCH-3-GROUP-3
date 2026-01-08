const express= require('express');

const upload = require("../middleware/videoUpload");

const course = require("../controller/adminCourseController");
const lesson = require("../controller/adminLessonController");
const quiz = require("../controller/adminQuizController");
const progress = require("../controller/adminProgressController");
const admin = require("../controller/AdminController");
const AuthCheckAdmin = require('../middleware/adminAuthCheck');

//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

const router=express.Router()


router.get('/',admin.login)
router.post('/login/create',admin.loginCreate)
router.get('/logout',admin.adminLogout)
router.get('/dashboard',AuthCheckAdmin,admin.dashboard)

// USER list
router.get('/users', AuthCheckAdmin ,admin.users)

// CREATE USER FORM
router.get('/users/create', AuthCheckAdmin, admin.userCreateForm);

// CREATE USER ACTION
router.post('/users/create', AuthCheckAdmin, admin.userCreate);

// EDIT USER FORM
router.get('/users/edit/:id', AuthCheckAdmin, admin.userEditForm);

// UPDATE USER ACTION
router.post('/users/update/:id', AuthCheckAdmin, admin.userUpdate);

// DELETE USER
router.get('/users/delete/:id', AuthCheckAdmin, admin.userDelete);

/* auth */
router.get("/", admin.login);
router.post("/login", admin.loginCreate);
router.get("/logout", admin.adminLogout);

/* dashboard */
router.get("/dashboard", admin.dashboard);

/* users already done */

/* courses */
router.get("/courses", course.index);
router.get("/courses/create", course.createForm);
router.post("/courses/create", upload.single('thumbnail'), course.store);
router.get("/courses/edit/:id", course.editForm);
router.post("/courses/update/:id", course.update);
router.get("/courses/delete/:id", course.delete);

/* lessons */
router.get("/lessons/:courseId", lesson.index);
router.post("/lessons/create", upload.single("thumbnail"), lesson.store);
router.get("/lessons/delete/:id", lesson.delete);

/* quiz */
router.get("/quiz/:lessonId", quiz.index);
router.post("/quiz/create", quiz.store);
router.get("/quiz/delete/:id", quiz.delete);

/* progress */
router.get("/progress", progress.index);

module.exports = router;
