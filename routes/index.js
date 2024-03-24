var express = require('express');
var router = express.Router();
var userModel = require("./users");
var postModel = require("./posts");
const passport = require('passport');
const upload = require('./multer');

var localStrategy = require('passport-local');
// passport.use(new localStrategy(userModel.authenticate()));

passport.use(new localStrategy(userModel.authenticate()));

router.get('/profile', isLoggedIn,async function (req, res,next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('posts');
  res.render('profile', {user});
});
router.get('/site', isLoggedIn,function (req, res,next) {
  res.render('site');
});
router.post('/upload', isLoggedIn,upload.single("file"), async function (req, res,next) {
  if(!req.file){
    return res.status(400).send('No files were uploaded.');
  }
  let user = await userModel.findOne({username: req.session.passport.user});
  const postdata = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id

  })
  user.posts.push(postdata._id);
  await user.save();
  res.send('done')

});
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/createduser', async function(req, res, next) {
  let createduser = await userModel.create({
    username: "harsh",
    password: "harsh",
    posts: [],
    email: "sarpalkunal7@gmail.com",
    fullName: "Kunal Sarpal",
  })
  res.send(createduser);
});
router.get('/createpost', async function(req, res, next) {
      let createdpost = await postModel.create({
        postText: "Hello kida ho saree",
        user: "6586d38c62a118d5faa98035"
      })
        let user = await userModel.findOne({_id: "6586d38c62a118d5faa98035"});
        user.posts.push(createdpost._id);
        await user.save();
        res.send("done");
});
router.get('/alluserpost', async function(req, res){
    let user = await userModel.findOne({_id: "6586d38c62a118d5faa98035"}).populate('posts');
    res.send(user)
});

router.post('/register', async function(req, res){
  let userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullName: req.body.fullName,
  })
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res, function(){
      res.redirect('/profile')
    });
  });
});

router.get("/login", function(req, res){
  res.render('login',{error: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
   successRedirect: '/profile',
   failureRedirect: '/login',
   failureFlash: true
}));


router.get('/logout', async function(req, res){
  req.logout(function(err){
    if(err){return next(err)};
    res.redirect('/login');
  })
});

function isLoggedIn(req, res,next){
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}
module.exports = router;
