var express = require('express');
var router = express.Router();
var ejs=require('ejs');
var mysql=require('mysql');
var mongoose=require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash')
var passport = require('passport')
const app = require('../app');
var bcrypt = require('bcrypt');
const { Passport } = require('passport');
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
 req.session.total=total;
 return total;
}
try{
  mongoose.connect('mongodb://127.0.0.1:27017/HoaBinh', {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false ,

 });
 console.log('success')
 }
 catch(error){
   console.log('loi')
 }


// tạo collection
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

const Login =mongoose.model('Login',login)


let Product=mongoose.model('products',products)
let Order=mongoose.model('orders',orders)


/* GET home page. */
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
router.get('/checkout', function(req, res) {
  var total=req.session.total;
  res.render('checkout',{total:total})
})
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
// function initialize(passport){
//   const authenticateUsers=async(name,password,done)=>{
//     const user=getUserByName(name)
//     if(user==null){
//       return done(null,false,{message:"no user"})
//     }
//    try {
//     if(await bcrypt.compare(req.body.password,user.password)){
//       return done(null,user)
//     }
//    } catch (error) {
//       return done(error)
//    } 
//   }
//   passport.use(new LocalStrategy({usernameField:'name'}))
//   passport.serializeUser((user,done)=>{})
//   passport.deserializeUser((user,done)=>{})


// }
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
//admin
router.get('/admin_products', function(req, res, next) {
 
  Product.find({},(error,data)=>{
    console.log('ds:',data)
      res.render('admin_products', { datas: data })
  })
});
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

//User
router.get('/user',async function(req, res, next) {
  var check= await Login.findOne({username:req.session.username})
  res.render('user',{check:check})
})
router.get('/get_session', (req, res) => {
  //check session
  if(req.session.cart){
      return res.status(200).json({status: 'success', session: req.session.cart})
  }
  return res.status(200).json({status: 'error', session: 'No session'})
})
 module.exports = router;
