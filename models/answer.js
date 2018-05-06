var mongoose = require("mongoose");

var answerSchema = mongoose.Schema({
    body:String,
    date : {type:Date, default:Date.now},
    author :  {
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User"
        },
        username:String
    }
});

module.exports = mongoose.model("Answer", answerSchema );