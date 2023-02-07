var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const login=require('../models/Login')
const Login =mongoose.model('Login',login)
const products=require('../models/products')
const Product=mongoose.model('products',products)
const orders=require('../models/orders')
let Order=mongoose.model('orders',orders)

router.get('/', function(req, res, next) {
    Product.find({},(error,data)=>{
      console.log('ds:',data)
        res.render('index', { results: data })
    })
  });
  //Iphone page
  router.get('/iphone',function(req,res){
    Product.find({type:'phone'},(error,iphone)=>{
      res.render('iphone',{iphones:iphone})
    })
  })
  // Samsung page
  router.get('/iphone',function(req,res){
    Product.find({type:'dt'},(error,samsung)=>{
      res.render('iphone',{samsungs:samsung})
    })
  })
  module.exports=router;
  