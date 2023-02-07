var express = require('express');
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/HoaBinh', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false ,

 });
 const login=new mongoose.Schema({
  
    username:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true,
    },
    email:{
      type:String,
      required:true,
    },
    
  
  },
  {
    collection:'login'
  })
  module.exports = login