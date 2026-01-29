const express= require('express');

const upload = require("../middleware/videoUpload");
const uploadImage=require("../middleware/imageUpload");
const course = require("../controller/adminCourseController");
const lesson = require("../controller/adminLessonController");
const quiz = require("../controller/adminQuizController");
const progress = require("../controller/adminProgressController");
const admin = require("../controller/AdminController");
const categories = require("../controller/adminCategoryController");

const about= require("../controller/aboutController");
const adminContact = require("../controller/adminContactController");

const AuthCheckAdmin = require('../middleware/adminAuthCheck');

//const multer = require('multer');
//const upload = multer({ dest: 'uploads/' });

const router=express.Router()


router.get('/',admin.login)
router.post('/login/create',admin.loginCreate)
// router.get('/logout',admin.adminLogout)
// router.get('/dashboard',AuthCheckAdmin,admin.dashboard)
/* Dashboard */
router.get("/dashboard", AuthCheckAdmin, admin.dashboard);

/* Profile */
router.get("/profile", AuthCheckAdmin, admin.profile);
router.post("/profile/update", AuthCheckAdmin, admin.updateProfile);

/* Logout */
router.get("/logout", AuthCheckAdmin, admin.adminLogout);

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
router.post("/courses/create", uploadImage.single('thumbnail'), course.store);
router.get("/courses/edit/:id", course.editForm);
router.post("/courses/update/:id", uploadImage.single('thumbnail'), course.update);
router.get("/courses/delete/:id", course.delete);

/* lessons */

router.get("/courses/:courseId/lessons", lesson.index);
router.get("/courses/:courseId/lessons/create", lesson.createForm);
router.post("/lessons/create", upload.single("video"), lesson.store);
router.get("/lessons/edit/:id", lesson.editForm);
router.post("/lessons/update/:id", upload.single("video"), lesson.update);
router.get("/lessons/delete/:id", lesson.delete);

/* quiz */
router.get("/quiz/:lessonId", quiz.index);
router.post("/quiz/create", quiz.store);
router.get("/quiz/delete/:id", quiz.delete);

/* progress */
router.get("/progress", progress.index);

//about

// Create about content
router.get("/about/create", AuthCheckAdmin, about.createPage);

// Read all / single
router.get("/about",AuthCheckAdmin, about.list);
router.get("/about/edit/:id", AuthCheckAdmin, about.editPage);
router.post("/about/store", AuthCheckAdmin, about.store); 

// Update by ID
router.put("/about/update/:id", AuthCheckAdmin, about.update);

// Delete by ID
router.post("/about/delete/:id",  about.delete);


// Trusted By
router.get("/about/trustedby", about.trustedByPage);
router.post("/about/trustedby/add", about.addTrustedBy);
router.post("/about/trustedby/delete/:index", about.deleteTrustedBy);

// Testimonials
router.get("/about/testimonials", about.testimonialsPage);
router.post("/about/testimonials/add", about.addTestimonial);
router.get("/about/testimonials/delete/:id", about.deleteTestimonial);

//adminContact
// Contact messages
router.get("/contacts", adminContact.contactList);
router.post("/contacts/delete/:id", adminContact.deleteContact);

// Contact info
router.get("/contact-info", adminContact.contactInfoPage);
router.post("/contact-info", adminContact.updateContactInfo);
//Categories
router.get("/categories", categories.index);
router.get("/categories/create", categories.createPage);
router.post("/categories", categories.store);
router.get("/categories/edit/:id", categories.editPage);
router.post("/categories/update/:id", categories.update);
router.post("/categories/delete/:id", categories.destroy);




module.exports = router;
