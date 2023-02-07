var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const login=require('../models/Login')
const Login =mongoose.model('Login',login)
const products=require('../models/products')
const Product=mongoose.model('products',products)
const orders=require('../models/orders')
let Order=mongoose.model('orders',orders)

router.post('/place_order', function(req, res) {
    const datas={
     name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    city:req.body.city,
    address:req.body.address,
    cost:req.session.total,
    status:"not paid",
    date : new Date(),
    
    }
    var product_ids=""
    var cart=req.session.cart;
    for(let i=0; i<cart.length; i++) {
      product_ids=product_ids+","+cart[i].id;
    }
    Order.insertMany([datas],product_ids)
    res.redirect('/payment')
  })
  router.get('/payment', function(req, res) {
    var total=req.session.total;
    res.render('payment',{total:total})
  })
  module.exports=router;