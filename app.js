
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');
require('dotenv').config();


const app= express();
const port = 5000|| process.env.PORT;
//connect to datbase
connectDB();

app.use(
    session({
        secret:process.env.ACCESS_TOKEN_SECRET,
        resave:false,
        saveUninitialized:false,
        cookie:{
            maxAge:1000 * 60 * 24 * 7 
        }
    })
);
app.use(cookieParser());
// flash Messages 
app.use(flash());
app.use((req,res,next)=>{
   res.locals.sucess_mesg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   next()
})
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// static files 
app.use(express.static('public'));
app.set('view engine','ejs');

app.use('/',require('./server/routes/route_pages'));
//API routes
app.use('/api',require('./server/routes/api_router'));
//app.all('*', controlpage.authheader);
app.get("*",(req,res) => {

     locals= {
         title :"Error page"
     }
    res.status(404).render("404",{locals});
})


app.listen(port,()=>{

    console.log(`app listening  to ${port}`)
})