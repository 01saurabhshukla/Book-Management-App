const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users_controller");
const Book=require('../models/book');
const multer=require('multer');
const {jwtAuthMiddleware, customAuthMiddlewareAdmin, customAuthMiddlewareUser, customAuthMiddlewareLogout} = require('../jwt');


let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

//middleware
let upload = multer({
  storage: storage,
}).single("image");


// router.get('/profile', usersController.home);
router.get("/sign-in", usersController.signIn);
router.get("/sign-up", customAuthMiddlewareUser,usersController.signUp);
router.get("/Add", customAuthMiddlewareAdmin ,usersController.addBookPage);
router.post("/addBook",upload, usersController.addBook);
router.get("/profile",customAuthMiddlewareUser ,usersController.profile);
router.get("/profile/:id", customAuthMiddlewareUser ,usersController.borrowBooks);
router.get("/Home/:id", customAuthMiddlewareUser , usersController.returnBooks);
router.post("/create", usersController.create);
router.post("/verify", usersController.verify);
router.get("/logout", customAuthMiddlewareLogout,usersController.logout);               
router.get("/forgetP",usersController.forgetP);                      //  checked for authentication middleware
router.post("/forget-password", usersController.forgetPassword);     //  checked for authentication middleware

// router.get('/add', usersController.addBook);

module.exports = router;
