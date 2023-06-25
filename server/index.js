'use strict'
//imports
const dayjs=require('dayjs')
const express = require('express');
const morgan = require('morgan'); // Middleware for logging messages
const cors = require('cors'); // Middleware to enable CORS support

const {check, validationResult} = require('express-validator'); // Middleware for validation

// DAO and Database Init
const CMS_dao = require("./CMS-dao");//module for accessing the pages table in the DB
const userDao = require("./user-dao");//module for accessing the user table in the DB


const session = require("express-session");

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

//Passport-related imports
const passport = require("passport"); //authentication middleware
const LocalStrategy = require("passport-local"); //authentication strategy(username and password)

// Passport: set up local strategy to search in the DB a user with matching password
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, cb) { 
  //double check that user is still in User db
  return userDao.getUserById(user.id)
  .then(user => cb(null, user))
  .catch(err => callback(err, null));
});

//creating the session
app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

//authentication verification of log in
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
  return res.status(401).json({error: 'Not authorized'});
}

/***API for Users and log in ***/

// POST /api/sessions
//This route that is used for performing login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        return res.status(401).send(info);
      }
   
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});


// GET /api/sessions/current
//This route check if the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
//This route checks that user is logged in or not
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

/*** Pages APIs ***/

//GET /api/pages
//This route return all pages in db
app.get('/api/pages',(req, res)=>{
  CMS_dao.listPages()
  .then(pages=>{
    res.json(pages)})
  .catch(()=>res.status(500).json(err));
});




//POST /api/pages
//This route add a new page to db
app.post('/api/pages',
  isLoggedIn,
[
  check('title').isLength({min: 1, max:160}),
  check('author').notEmpty(),
  check('creationDate').isDate({format: 'YYYY-MM-DD', strictMode: true})
],
async (req, res)=>{
  const errors = validationResult(req).formatWith(errorFormatter);;
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array().join(", ")});
  }
  const newPage=req.body;
  /***control that author name is the same of user in case user 
  * is a regular user and he can't change name of author***/
  if(req.user.role=='author' && newPage.author!==req.user.name){
    console.error(`ERROR: ${e.message}`);
    res.status(401).json({error: 'Not Authorized'});
  }
  else{
    try{
      const result= await CMS_dao.addPage(newPage);
      if (result.error)
        res.status(400).json(result);
      else
        res.status(201).json(result)
    }catch(e){
      console.error(`ERROR: ${e.message}`);
      res.status(503).json({error: 'Impossible to create the page, there is database error during the creation of new Page'});
    }
  }
});

//PUT /api/pages/<id>
/**This route allows to modify a page, specifiyng its id and title,
 *author and creationDate cannot be empty, only publicationDate can be*/
app.put('/api/pages/:id',
  isLoggedIn,
 [
  check('title').isLength({min: 1, max:160}),
  check('author').notEmpty(),
  check('creationDate').isDate({format: 'YYYY-MM-DD', strictMode: true})
],async (req,res)=>{
  const errors = validationResult(req).formatWith(errorFormatter);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array().join(", ")});
  }
  const pageToUpdate=req.body;
  const pageId=req.params.id;

if(req.user.role=='author' && pageToUpdate.author!==req.user.name){
    console.error(`ERROR: ${e.message}`);
    res.status(401).json({error: 'Not Authorized'});
}else{
  try{
    const result=await CMS_dao.updatePage(pageToUpdate,pageId) 
    if(result.error)
    res.status(400).json(result)
    else
    res.status(201).json(result);
  } catch {
    res.status(503).json({'error': `Impossible to update page #${pageId}.`});
  }
}
});

//DELETE /api/pages/:id
/***Given a page id, This route deletes page  ***/
app.delete('/api/pages/:id',
  isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
     
      const pageToDelete=req.body;
      const pageId=req.params.id;
      const result = await CMS_dao.deletePage(pageToDelete,pageId);
      if (result == null)
        return res.status(200).json({}); 
      else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of page ${req.params.id}: ${err} ` });
    }
  }
);
/***title APIs ***/

//POST /api/pages/title
/***This route add a title if user is an admin and can change name of website ***/
app.post('/api/pages/admin/title',
  isLoggedIn,
[ check('title').notEmpty(),
],async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  if(req.user.role==='admin'){
    const titleUp=req.body;
  try{
  const result= await CMS_dao.editTitle(titleUp);
  if (result.error)
    res.status(400).json(result);
  else
  res.status(201).json(result)
  }catch(e){
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the page.'});
  }
 }else 
    res.status(401).json({error:'Not authorized'})
});


//GET /api
//This route return title of the website
app.get('/api/',async (req, res)=> {
  CMS_dao.getTitle()
  .then(title=>{
    res.json(title)})
  .catch(()=>res.status(500).json(err));
});


app.listen(port, () => 'API server started');