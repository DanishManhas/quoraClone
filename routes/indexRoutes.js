var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");






    router.get("/", function(req, res){
      res.redirect("/questions");
  })


// AUTH ROUTES

router.get("/register", function(req,res){
  res.render("register");
});
// SIGN UP LOGIC
router.post("/register", function(req,res){
  var newUser = new User({username:req.body.username});
  User.register(newUser, req.body.password, function(err,user){
    if (err) {
      console.log(err);
      return res.render("register");
      
    } 
      passport.authenticate("local")(req,res,function(){
        res.redirect("/questions");
      })
    
  });
});


router.get("/login", function(req, res){
  res.render("login");
})

// HANDLING  LOGIN LOGIC

router.post("/login", passport.authenticate("local",{
  successRedirect:"/questions",
  failureRedirect:"/login",
  failureflash:true
}));

// LOGOUT ROUTE
router.get("/logout", function(req, res){
  req.logout();

  res.redirect("/cquestions");
})



module.exports = router;

