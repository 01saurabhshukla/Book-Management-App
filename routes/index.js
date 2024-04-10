const express = require("express");
const router = express.Router();
const userController = require("../controllers/users_controller")
const Book = require('../models/book');



router.get("/",async(req,res)=>{
    let data=await Book.find();
    // console.log(res.locals.userLoggedIn);
    res.render('home',{
        userType: res.locals.userType,
        userLoggedIn : res.locals.userLoggedIn,
        user: res.locals.user, 
        title:'Home page',
        books:data,
    });
})

// router.get("/profile",require("./users"))
// router.post("/sign-in",require("./users"))
// // router.get("/register",require("./users"))
// router.post("/sign-up",require("./users"))
router.use("/users",require("./users"))
// router.get("/add",require("./users"))



module.exports = router;
