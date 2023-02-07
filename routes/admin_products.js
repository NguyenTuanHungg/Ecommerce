var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const login=require('../models/Login')
const Login =mongoose.model('Login',login)
const products=require('../models/products')
const Product=mongoose.model('products',products)
const orders=require('../models/orders')
let Order=mongoose.model('orders',orders)

//add
router.get('/form-add',function(req,res){
    res.render('form-add')
  })
  router.post('/add', function(req, res, next) {
    Product.create(req.body);
    res.redirect('/admin_products')
  })
  //update
  router.get('/form-update/:id', function(req, res, next) {
    Product.findById(req.params.id,(error,data)=>{
      res.render('form-update',{datas:data})
    })
  })
    router.post('/update', function(req, res, next) {
      Product.findByIdAndUpdate(req.body.id,req.body,(error,data)=>{
        res.redirect('/admin_products')
      });
      
    })
    //Delete
  router.get('/delete/:id', function(req, res, next) {
    Product.findByIdAndDelete(req.params.id,(error,data)=>{
      res.redirect('/admin_products')
    })
  })
  router.get('/search',function(req, res, next) {
   
   
      Product.find( {$or:[{name:{ $regex:req.query.dsearch}},{type:{$regex:req.query.dsearch}}]},(err,data)=>{
      res.render('admin_products',{datas:data})
    } );
    
  })
  module.exports=router;