var express=require('express');
var router=express.Router();
var mongoose=require('mongoose');
const login=require('../models/Login')
const Login =mongoose.model('Login',login)
const products=require('../models/products')
const Product=mongoose.model('products',products)
const orders=require('../models/orders')
let Order=mongoose.model('orders',orders)

function isProductInCart(cart,id){
    for(let i=0;i<cart.length;i++){
      if(cart[i].id==id){
        return true;
      }
  }
  return false;
  }
   function caculateTotal(cart,req){
    total=0;
    for(let i=0;i<cart.length;i++){
      if(cart[i].price){
        total+=(cart[i].price*cart[i].quantity);
      }
  }
}
//add to cart
router.post('/add_to_cart', function(req, res, next) {
    var id=req.body._id;
    var name=req.body.name;
    var price=req.body.price;
    var quantity=req.body.quantity;
    var product={id:id, name:name, price:price, quantity:quantity}
    if(req.session.cart){
      var cart = req.session.cart;
      if(!isProductInCart(cart,id)){
        cart.push(product)
       
      }
      
    }
    else{
      req.session.cart=[product];
      var cart=req.session.cart
    }
    //caculate
    caculateTotal(cart,req);
    res.redirect('/cart')
  })
  router.get('/cart',async(req,res)=>{
  var check= await Login.findOne({username:req.session.username})
  
   var cart=req.session.cart
   var total=req.session.total
   res.render('cart',{cart:cart,total:total,check:check})
  })
  router.post('/remove_product',function(req,res){
    var id=req.body._id
    
    var cart=req.session.cart
    for(let i=0;i<cart.length;i++){
      if(cart[i].id==id){
        cart.splice(cart.indexOf(i),1)
      }
    }
    caculateTotal(cart,req);
    res.redirect('/cart')
  })
  router.post('/edit_product_quantity',function(req,res){
    //get values from inputs
    var id = req.body._id
    var quantity = req.body.quantity
    var increase_btn=req.body.increase_product_quantity;
    var decrease_btn=req.body.decrease_product_quantity;
    var cart=req.session.cart
    if(increase_btn){
      for(let i=0;i<cart.length;i++){
        if(cart[i].id==id){
          if(cart[i].quantity>0){
            cart[i].quantity=parseInt(cart[i].quantity) + 1;
          }
      }
    }
  }
  if(decrease_btn){
    for(let i=0;i<cart.length;i++){
      if(cart[i].id==id){
        if(cart[i].quantity>1){
          cart[i].quantity=parseInt(cart[i].quantity)-1;
        }
    }
  }
  }
  caculateTotal(cart,req);
  res.redirect('/cart')
  })
  module.exports=router;