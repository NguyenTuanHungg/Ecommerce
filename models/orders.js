var express = require('express');
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/HoaBinh', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false ,

 });
 let orders=mongoose.Schema({
    name:{
      type:String,
    },
    email:{
      type:String,
    },
    address:{
      type:String,
    },
    status:{
      type:String,
    },
    city:{
      type:String,
    },
    phone:{
      type:String,
    },
    date:{
      type:Date,
    }
  },
  {
    collection:'orders'
  }
  );
  module.exports = orders;