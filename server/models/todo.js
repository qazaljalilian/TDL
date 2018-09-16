var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
text:{
    trim:true,
    type:String,
    minlength:1,
    required:true
},

});
module.exports={Todo};