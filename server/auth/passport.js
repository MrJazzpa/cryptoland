const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/signup_model");
const bcrypt = require('bcryptjs');


    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            async(email,password,done) =>{
            try {
                   
                  //finding the user by email in the database
                  const user = await  User.findOne({email:email})
                  // return error is user does not exixt
                  if(!user){
                     
                   return done (null,false,{error:"Incorrect email"});
   
                  }
   
                  // compare provided  password with the hashed passwprd
                  const passwordMatch = await bcrypt.compare(password,user.password);
                     
                  // return user password if password match 
                  if(passwordMatch){
   
                     return done(null,user)
   
                  }else{
                           return done(null,false,{error:"incorrect password"});
                  } 
                  
               
            } catch (error) {
              return  done(null,false,{error:"Login Failed"})
            }
   
        })
   );
   

