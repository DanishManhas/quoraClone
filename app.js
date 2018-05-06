var express      = require("express"),
        app      = express(),
        mongoose = require("mongoose"),
      bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  passport       = require("passport"),
  LocalStrategy  = require("passport-local"),
        Question = require("./models/question"),
        Answer   = require("./models/answer"),
        // seedDB   = require("./seeds"),
            User = require("./models/user"),
      middleware = require("./middleware");

 var indexRoutes = require("./Routes/indexRoutes");       


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/my_quora_clone");

// seedDB();

app.use(require("express-session")({
    secret:"Once again, Rusty wins cutest dog",
    resave:false,
    saveUninitialized:false
  }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + "public"));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
   
    next();
  });


app.use("/",indexRoutes);




 app.get("/questions",function(req, res){
     Question.find({}, function(err,allquestions){
         if (err) {
             console.log(err);
         } else {
            // console.log(allquestions);
            res.render("index", {questions:allquestions});
         }
       
     });
 
 });

 app.get("/questions/new",middleware.isLoggedIn, function(req, res){
     res.render("questions/new");
     })


 app.post("/questions",middleware.isLoggedIn, function(req, res){
     var question = {title:req.body.title,
    author:{id:req.user._id,
    username:req.user.username}
};
    Question.create(question, function(err, createdQuestion){
        if (err) {
            console.log(err);
        } else {
            createdQuestion.save();
            res.redirect("/questions");
        }
    })
    
    
 })

 app.get("/questions/:id", function(req, res){
     
    Question.findById(req.params.id).populate("answers").exec( function(err, foundQuestion){
        if (err) {
            console.log(err);
            res.redirect("/questions");
        } else {
            res.render("questions/show",{question:foundQuestion});
        }
 })
});

app.get("/questions/:id/edit",middleware.checkQuestionOwnership, function(req,res){
    Question.findById(req.params.id, function(err,foundQuestion){
        if (err) {
            res.redirect("/questions/req.params.id");
            console.log(err);
        } else {
            res.render("questions/edit",{question:foundQuestion});
        }
    });
});


app.put("/questions/:id",middleware.checkQuestionOwnership, function(req,res){
    Question.findByIdAndUpdate(req.params.id,req.body.question, function(err){
        if(err){
            console.log(err);
            res.redirect("/questions");
        }
        else{
            res.redirect("/questions/" + req.params.id);
        }
    })
});


app.delete("/questions/:id",middleware.checkQuestionOwnership, function(req, res){
    Question.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/questions/" +req.params.id);
        } else {
            res.redirect("/questions");
        }
    })
});


//COMMENTS ROUTES
 
// COMMENT NEW ROUTE

app.get("/questions/:id/answers/new", middleware.isLoggedIn, function(req, res){
    Question.findById(req.params.id, function(err, foundQuestion){
        if (err) {
            console.log(err);
            res.redirect("/questions");
        } else {
            res.render("answers/new", {id:foundQuestion._id});
        }
    })
    
})

 // Answer CReate ROUTE
 app.post("/questions/:id", middleware.isLoggedIn, function(req, res){

    var answer = {
        body:req.body.body,
        author:{id:req.user._id,
        username:req.user.username}
    }
    console.log(answer.author.username);
     Question.findById(req.params.id, function(err, question){
         if (err) {
             console.log(err);
             //res.redirect("/question" +req.params.id);
         } else {
             Answer.create(answer, function(err, createdAnswer){

                
                 if (err) {
                     console.log(err);
                     
                 } else {
                     createdAnswer.save();
                     question.answers.push(createdAnswer);
                     question.save();
                    
                 }
             })
         }
         res.redirect("/questions/" +req.params.id);
     })
 });


//ANSWER EDIT ROUTE
app.get("/questions/:id/answers/:answer_id/edit", middleware.checkAnswerOwnership, function(req, res){
    Answer.findById(req.params.answer_id, function(err, answer){
        if (err) {
            console.log(err);
            res.redirect("/questions/" +req.params.id);
        } else {
            res.render("answers/edit", {
                question_id :req.params.id,
                answer:answer
            });
        }
    })
})

 //ANSWER UPDATE ROUTE
 app.put("/questions/:id/answers/:answer_id", middleware.checkAnswerOwnership, function(req, res){
     Answer.findByIdAndUpdate(req.params.answer_id, req.body.answer, function(err){
         if (err) {
             console.log(err);
             res.redirect("/questions/"+ req.params.id +"/answers/" + req.params.answer_id +"/edit");
         } else {
             res.redirect("/questions/"+ req.params.id);
         }

     })
 })

 // ANSWER DELETE ROUTE

 app.delete("/questions/:id/answers/:answer_id", middleware.checkAnswerOwnership, function(req, res){
   Answer.findByIdAndRemove(req.params.answer_id, function(err){
       if(err){
           console.log(err);
       }
       res.redirect("/questions/" + req.params.id);
   })  
 })



 
 app.listen(process.env.PORT || "3000", function(){
     console.log("Quora has started");
 })