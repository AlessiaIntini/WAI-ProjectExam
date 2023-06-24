'use strict'
//imports
const dayjs=require('dayjs')
const express = require('express');
const morgan = require('morgan'); // Middleware for logging messages
const cors = require('cors'); // Middleware to enable CORS support
const {check, validationResult} = require('express-validator'); // Middleware for validation

// DAO and Database Init
const CMS_dao = require("./CMS-dao");
 const userDao = require("./user-dao");

//Passport-related imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
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


// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


// POST /api/sessions
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

//ROUTES
//GET /api/pages
app.get('/api/pages',(req, res)=>{
  CMS_dao.listPages()
  .then(pages=>{
    res.json(pages)})
  .catch(()=>res.status(500).end());
});
//GET /api/session/current
app.get('/api/',async (req, res)=> {
  // const result= await CMS_dao.getTitle();
  // if (result.error)
  //   res.status(400).json(result);
  // else
  // //res.send(result);
  // res.status(201).json(result)
  CMS_dao.getTitle()
  .then(title=>{
    res.json(title)})
  .catch(()=>res.status(500).end());
});



//POST /api/pages
app.post('/api/pages',[
  isLoggedIn,
  check('title').notEmpty(),
  check('author').notEmpty(),
  check('creationDate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
  check('publicationDate').isDate({format: 'YYYY-MM-DD', strictMode: true})
],async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
 
  const newPage=req.body;
  console.log(newPage)
  try{
  const result= await CMS_dao.addPage(newPage);
  if (result.error)
    res.status(400).json(result);
  else
  //res.send(result);
  res.status(201).json(result)
  }catch(e){
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the page.'});
  }
});

//PUT /api/pages/<id>
app.put('/api/pages/:id',[
  //isLoggedIn,
  check('title').notEmpty(),
  check('author').notEmpty(),
  check('creationDate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
  check('publicationDate').isDate({format: 'YYYY-MM-DD', strictMode: true})
],async (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  const pageToUpdate=req.body;
  const pageId=req.params.id;

  try{
    const result=await CMS_dao.updatePage(pageToUpdate,pageId) 
    if(result.error)
    res.status(400).json(result)
    else
    res.status(201).json(result);
  } catch {
    res.status(503).json({'error': `Impossible to update page #${pageId}.`});
  }
  
});

app.delete('/api/pages/:id',
  isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
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

//POST /api/pages/title
app.post('/api/pages/admin/title',[
  //isLoggedIn
],async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  //if(req.user.role==='admin'){
    const titleUp=req.body;
  try{
  const result= await CMS_dao.editTitle(titleUp);
  if (result.error)
    res.status(400).json(result);
  else
  //res.send(result);
  res.status(201).json(result)
  }catch(e){
    console.error(`ERROR: ${e.message}`);
    res.status(503).json({error: 'Impossible to create the page.'});
  }
// }else 
//   res.status(401)
});



app.listen(port, () => 'API server started');