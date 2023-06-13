'use strict'
//imports
const express = require('express');
const morgan = require('morgan'); // Middleware for logging messages
const cors = require('cors'); // Middleware to enable CORS support
// const {check, validationResult} = require('express-validator'); // Middleware for validation

// DAO and Database Init
const CMS_dao = require("./CMS-dao");
// const user_dao = require("./user-dao");

// Passport-related imports
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const session = require("express-session");

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(express.json()); // for parsing json request body
app.use(morgan("dev"));
// set up and enable cors
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

//ROUTES
app.get('/api/pages',(request, response)=>{
  CMS_dao.listPages()
    .then(pages=>response.json(pages))
    .catch(()=>response.status(500).end());
});

// // Passport: set up local strategy
// passport.use(new LocalStrategy(async function verify(username, password, cb) {
//   const user = await userDao.getUser(username, password);
//   if(!user)
//     return cb(null, false, 'Incorrect username or password.');
    
//   return cb(null, user);
// }));

// passport.serializeUser(function (user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function (user, cb) { // this user is id + email + name
//   return cb(null, user);
//   // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
// });

// const isLoggedIn = (req, res, next) => {
//   if(req.isAuthenticated()) {
//     return next();
//   }
//   return res.status(401).json({error: 'Not authorized'});
// }

// app.use(session({
//   secret: "shhhhh... it's a secret!",
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.authenticate('session'));

// //ROUTES
app.listen(port, () => 'API server started');