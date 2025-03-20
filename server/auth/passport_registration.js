const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const Users = require('../models/signup_model');

passport.use(
    "local-signup",
    new LocalStrategy(
        {   usernameField:"name",
            usernameField:"email",
            passwordField:"password",
            passwordField: "confirm_password",
        },
        async(name,email,password,comfirm_password,done)=>{
            
            if(!name,!email,!password,!comfirm_password){
                return done (null,false)
            }
            if(comfirm_password !=password){
                return done(null,false)
            }
            try{
                const existingUser = await Users.findOne({email});
                if(existingUser){
                   return res.status(409).json({error:existingUser.email});
       
                }
                // hash password
               const salt = await bcrypt.genSalt(15);
               const hashedpassword = await bcrypt.hash(password,salt);
               
               //create new user
               const newUsers =({name,email,password:hashedpassword});
                 const  user= await Users.create(newUsers)
                 return done(null,user);
            }catch(error){
                done(error)
            }
        }
    )
)
module.exports = passport;
 