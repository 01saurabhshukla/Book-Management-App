const jwt = require("jsonwebtoken");

const customAuthMiddlewareAdmin = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization) {

    res.redirect("/users/sign-in");
    next();

  } else {

    const token = req.headers?.cookie?.split("=")[1]; // What an error sir ji ?
    console.log(token);

    if (!token) return res.status(401).redirect("/users/sign-in");;

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Attach user information to the request object
      if(decoded.userType === 'admin'){
        next();
      }
      else{
        res.redirect('/users/sign-up');
        next();
      }
    } catch (err) {
      console.error(err);
      // return res.redirect('/');
      res.status(401).json({ error: "Invalid token" });
    }
  }
};
const customAuthMiddlewareUser = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization) {

    res.redirect("/users/sign-in");
    next();

  } else {

    const token = req.headers?.cookie?.split("=")[1]; // What an error sir ji ?
    console.log(token);

    if (!token) return res.status(401).redirect("/users/sign-in");;

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Attach user information to the request object
      if(decoded.userType === 'user'){
        next();
      }
      // else if (decoded.userType === 'admin'){
      //   next();
      // }
      else{
        res.redirect('/users/sign-up');
        next();
      }
    } catch (err) {
      console.error(err);
      // return res.redirect('/');
      res.status(401).json({ error: "Invalid token" });
    }
  }
};
const customAuthMiddlewareLogout = (req, res, next) => {
  const authorization = req.headers.cookie;

  if (!authorization) {

    res.redirect("/users/sign-in");
    next();

  } else {

    const token = req.headers?.cookie?.split("=")[1]; // What an error sir ji ?
    console.log(token);

    if (!token) return res.status(401).redirect("/users/sign-in");;

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);

      // Attach user information to the request object
      if(decoded.userType === 'user'  || decoded.userType === 'admin' ){
        next();
      }
      else{
        res.redirect('/users/sign-up');
        next();
      }
    } catch (err) {
      console.error(err);
      // return res.redirect('/');
      res.status(401).json({ error: "Invalid token" });
    }
  }
};





const jwtAuthMiddleware = (req, res, next) => {
  // first check request headers has authorization or not
  const authorization = req.headers.cookie;

  // IS UNDEFINED JITNA TANG KIYA HAI SHAAYAD HI KISINE KIYA HOGA

  //   console.log(authorization);
  //   console.log(req.headers);

  // ---------------------------------------------------------------
  // if(!authorization) return res.status(401).redirect('/');

  if (!authorization) {
    res.locals.userLoggedIn = false;
    next();
  } else {
    // Extract the jwt token from the request headers

    // Bhai ne error handle kiya hai
    const token = req.headers?.cookie?.split("=")[1]; // What an error sir ji ?
    console.log(token);

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded -> info",decoded);

      // Attach user information to the request object

      req.user = decoded;
      res.locals.userLoggedIn = true;
      res.locals.userType = decoded.userType;

      next();
    } catch (err) {
      console.error(err);
      // return res.redirect('/');
      res.status(401).json({ error: "Invalid token" });
    }
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  // Generate a new JWT token using user data
  return jwt.sign(userData, process.env.JWT_SECRET);
};

module.exports = { jwtAuthMiddleware, generateToken, customAuthMiddlewareAdmin, customAuthMiddlewareUser, customAuthMiddlewareLogout };
