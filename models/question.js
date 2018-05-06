var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
    title:String,
    date:{type:Date, default:Date.now},
    author: {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
        },
        username:String
    },
    answers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Answer"
    }]
});

var question = mongoose.model("Question", questionSchema);

module.exports = question;