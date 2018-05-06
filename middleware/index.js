var Question    = require("../models/question"),
    Answer       = require("../models/answer");
var middlewareObj = {};


// CAMPGROUND AUTHORIZATION MIDDLEWARE
middlewareObj.checkQuestionOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
      Question.findById(req.params.id, function(err, foundQuestion){
       if (err || !foundQuestion) {
     
         res.redirect("/campgrounds");
      } else {
        if (foundQuestion.author.id.equals(req.user._id)) {
           next();
        } else {
  
          res.redirect("back");
        }
      }
    
     })
  } else {
    req.flash("error", "You're not logged in")
    res.redirect("/login");
  }
}

// Answer AUTHORIZATION MIDDLEWARE
middlewareObj.checkAnswerOwnership = function(req, res, next){
  if (req.isAuthenticated()) {
    Answer.findById(req.params.answer_id, function(err, foundAnswer){
      if (err || !foundAnswer) {
       
        res.redirect("back");
      } else if(foundAnswer.author.id.equals(req.user._id)) {
        next();
      } else{
      
        res.redirect("back");
      }
    })
  } else {
    
    res.redirect("/login");
  }
}


// LOGIN MIDDLEWARE
middlewareObj.isLoggedIn = function(req, res, next){
  if (req.isAuthenticated()) {
   return next();
}
 
  res.redirect("/login");
}

module.exports = middlewareObj;