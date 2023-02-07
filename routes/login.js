var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const login=require('../models/Login')
const Login =mongoose.model('Login',login)
const products=require('../models/products')
const Product=mongoose.model('products',products)
const orders=require('../models/orders')
let Order=mongoose.model('orders',orders)


router.get('/login', function(req, res) {

    res.render('login')
  })
  router.get('/signup', function(req, res) {
  
    res.render('signup')
  });
   
  router.post('/signup', function(req, res) {
    const data={
      username:req.body.username,
      password:req.body.password,
      email:req.body.email,
    }
    Login.insertMany([data])
    res.redirect('/')
  })
  router.post('/login',async(req, res)=> {
    try {
      var check= await Login.findOne({username:req.body.username})
      var user=check.username
      if(check){
      if (check.password === req.body.password ){
        req.session.username=check.username
        if(check.username.toString()==="admin"){
          
          res.redirect('/admin_products')
        }
        else{
        res.redirect('/')
        }   
    } 
      
      else{
        res.send('wrong password')
      }
     
    }
    } catch (error) {
      res.send("wrong details")
    }
    
  })
  router.post('/logout',(req,res)=>{
    var cart = req.session.cart
    req.session.destroy((err)=>{
      if(err) {
              return console.log(err);
          }
      cart=null; 
          res.redirect('/login');
   
    
  })
  });
  
  //Change Password
  router.get('/changepassword',(req,res)=>{
  res.render('changepassword')
  })
  
  router.post('/change',async(req,res)=>{
    await Login.findOne({username:req.session.username,password:req.body.password1},(err,user)=>{
      user.password = req.body.password2
      res.redirect('/')
    })
  })

  //User
router.get('/user',async function(req, res, next) {
    var check= await Login.findOne({username:req.session.username})
    res.render('user',{check:check})
  })
  module.exports=router;