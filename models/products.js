var express = require('express');
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/HoaBinh', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false ,

 });
 let products=mongoose.Schema({
    name:{
     type:String,
    },
    description:{
    type:String,
    },
    price:{
      type:Number,
    },
    category:{
      type:String,
    },
    quantity:{
      type:Number,
    },
    type:{
      type:String,
    }
    ,image:{
      type:String,
    }
    
    },{
    collection:'products'
    }
    )
  module.exports =products