const express = require("express");
const router = express.Router();

module.exports.home = async function (req, res) {
    router.get("/",async(req,res)=>{
        let data=await Book.find();
        res.render('home',{
            title:'Home page',
            books:data,
        });
    })
};
