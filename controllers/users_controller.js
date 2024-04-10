const express = require("express");
const router = express.Router();
const User = require('../models/user')
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const Book=require('../models/book');
const multer=require('multer');
const addProfile = require('../models/profile');
const { redirect } = require("express/lib/response");



module.exports.borrowBooks = async(req,res)=>{
  let result=await Book.findOne({_id:req.params.id})
  const borrow=new addProfile({
      bookname:result.bookname,
      authorname:result.authorname,
      price:result.price,
      summary:result.summary,
      image:result.image,
      bookId:req.params.id
  });
 let data = await Book.updateOne(
      { _id: req.params.id },
      { mark: true }
    );
  borrow.save();
  res.redirect("/") ;
}


module.exports.returnBooks = async(req,res)=>{
  const data=await addProfile.findOne({_id:req.params.id});
  await addProfile.deleteOne({_id:req.params.id})
  let result=await Book.updateOne(
      { _id: data.bookId },
      { mark: false }
    );
  res.redirect("/user_profile");
}



//Insert book in database
module.exports.addBook = async (req,res)=>{
  const book=new Book({
      bookname:req.body.bookname,
      authorname:req.body.authorname,
      price:req.body.price,
      summary:req.body.summary,
      image:req.file.filename,
      mark:false
  });
  try{
      await book.save();
      return res.redirect("/users/Add");
  }catch(error)
  {
      console.log(error);
  }
  

}


module.exports.profile = async function (req, res) { 
    let data=await addProfile.find();
    try {
      res.render('user_profile',{
        title:'Profile',
        addBook:data
    });
    }
    catch(err){
      console.log('error:',err);
    }
    
}




module.exports.addBookPage = async (req, res) => {
  try {
    return res.render("add_book", {
      title: "Sign-Up",
    });
  } catch (err) {
    console.log(`Your Error is --> ${err}`);
  }
};


module.exports.signIn = function (req, res) {
  
  return res.render("login", {
    title: "login In",
  });
};


module.exports.signUp = function (req, res) {

  return res.render("signup", {
    title: "Sign Up",
  });
};

// POST route to add a person
module.exports.create = async (req, res) =>{
  try{
      // console.log(req.body);
      const data = req.body // Assuming the request body contains the person data

      // Create a new user document using the Mongoose model
      // const newUser = new User(data);

      const user=new User({
        userType:data.userType,
        name:data.name,
        id:data.id,
        password:data.password
     })

      // Save the new person to the database
      const response = await user.save();
      console.log('data saved');

      const payload = {
          id: response.id,
          username: response.username,
          userType: response.userType
      }
      console.log(JSON.stringify(payload));
      const token = await generateToken(payload);
      console.log("Token is : ", token);

      res.cookie('token', token, { httpOnly: true });

      // return res.status(200).json({response: response, token: token}).redirect('/');
      return res.status(200).redirect('/');
  }
  catch(err){
      console.log(err);
      return res.status(500).json({error: 'Internal Server Error'}).redirect('/');
  }
}

// Login Route
module.exports.verify = async(req, res) => {
  try{
      // Extract username and password from request body

        
      const {name, password} = req.body;
      // console.log(req.body.name);

      // Find the user by username
      const user = await User.findOne({name: name});
      // console.log(user);

      // If user does not exist or password does not match, return error
      if( !user || !(await user.password === password )){
          return res.status(401).json({error: 'Invalid username or password'});
      }

      // generate Token 
      const payload = {
          name: user.name,
          userType: user.userType
      }
      const token = generateToken(payload);
      // console.log(token);

      res.cookie('token', token, { httpOnly: true });

      // return res.status(200).json({response: response, token: token}).redirect('/');
      return res.status(200).redirect('/');
      // return res.status(200).json({token}).redirect('/');
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports.logout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).redirect('/');
  }

  module.exports.forgetP = async (req, res) => {
    return res.render("forgetPassword", {
      title: "Forget-Password",
    });
  }

  module.exports.forgetPassword = async (req,res) => { 

    // sabse pehle 
    // 1. issue aya tha galat name ko extraction wo resolve hua debugging forgetPASSWORD PAGE KO theek kiya
    // 2. logout ka functionality use kiya 
    // 3. Login Hone par hi specific navigation dikhaunga warna nhi 
    // 4. routes protected karne ke liye req.headers.cookie mai se jake data nikal ke laya


    // console.log("req.body _>",req.body);
    const {name, currentPassword, newPassword} = req.body;
    // console.log("name",name);
    // console.log("name",newPassword);
    // console.log("name",currentPassword);
    if(currentPassword !== newPassword){
      const user = await User.findOne({name: name});
      // console.log(user);
      
      user.password = newPassword;
      // console.log('user.password -> ',user);
      await user.save();
      return res.redirect('/users/sign-in');
    }
    else{
      return res.redirect('/')

    }


  }