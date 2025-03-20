const Users = require('../models/signup_model');
const bcrypt = require('bcryptjs');
const transporter = require('../middleware/sendmail');
const verify_model = require('../models/verificationCode_model');
 const jwt = require('jsonwebtoken');
//post requests
const sendmail = async function(from,to,subject,text){
    const mailOptions ={
        from: from,
        to,
        subject,
        text

    }
     try{

         await transporter.sendMail(mailOptions);
        
     }catch(error){
        console.error(error)
     }
}
const Code = Math.floor(1000 + Math.random() * 9000);
verify_code = Code.toString();
exports.post_signup = async(req, res) =>{
     const subject = "Verify Email";
     quick_text = " Hello "+req.body.Name+"\n Welcome to CryptoTrust.com. \n find your one time code bellow \n  "+verify_code+" \n expires in five Minutes"
   if(req.body.Password == req.body.con_password){

        const name = req.body.Name;
        const email = req.body.Email;
        const password = req.body.Password
      
      //check if user already exists before registring 
      const existingUser = await Users.findOne({email});
      if(existingUser){
          res.json({error:existingUser.email+" already exists",status:403});
      }else{
                 // hash password
              const salt = await bcrypt.genSalt(15);
            const hashedpassword = await bcrypt.hash(password,salt);
     
     //create new user
     const newUsers =({name,email,password:hashedpassword});
      await Users.create(newUsers)
            .then(async()=>{

                const sendcode = await verify_model.create({code:verify_code,email:email});
                if(sendcode){

                    const check= sendmail(process.env.EMAIL,email,subject,quick_text);
                    if(check){
                        res.status(200).json({message:"email has been sent "+email,status:200})
                       
                    }else{
                      res.status(400).json({error:"could not send email"});
                    }

                }else{
                    res.status(400).json({error:"could not send code to database "})     
                }

            })
            .catch(error=>{
                res.json({error:error.message,staus:403})
            })
      }
     
      //

   }else{
       return  res.status(500).json({message:"password does not match"})
     
   }
 
     
 }

 exports.post_login = async(req,res) =>{
     const email= req.body.Email;
     const password = req.body.Password;
     try{
        const user = await Users.findOne({email:email});
        if(!user){
            return res.json({error:"User not found",status:403});
        }else{
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.json({error:"Invalid Credentials",status:403});
            }else{
                const token = jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});
                res.cookie("jwt",token,{httpOnly:true,maxAge:36000000});
                return res.json({token:token,status:200})
            }
        }
       
  }catch(err){
      return res.status(400).json({error:err.message})
  }
      
   
 }

 //logout
 exports.logout = async(req,res)=>{
      req.logout((err)=>{
         if(err){
              return res.status(500).json({message:"error logging out"})
         }else{
              res.json({message:"logout Successfull"})
         }
      })
 }


 // check auth status
 exports.status = async(req,res)=>{
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: { username: req.user.username } });
    } else {
        res.json({ isAuthenticated: false });
    }
 }
 exports.currentUser = async(req,res)=>{  
     req.session.user = req.user.email;
     req.session.save();
     res.status(200).json(req.session.user);
    
       
     // res.json({message:"Current User Page"});
 }
 
 exports.resend_verification_email = async(req,res)=>{
      const email = req.body.Email;
      const subject = "Verification Code";
      const quick_text = " Hello!! \n Welcome to CryptoTrust.com. \n find your one time code bellow \n  "+verify_code+" \n expires in five Minutes";
        try{
            const update_code_expired = await verify_model.findOneAndUpdate({email:email},{code:verify_code})
            if(update_code_expired){
              const resend_code= sendmail(process.env.EMAIL,email,subject,quick_text);
              if(resend_code){
                  const update_expired = await verify_model.updateOne({email:email},{verification_status:"not expired"});
                  if(update_expired){
                    res.json({message:"code has been resent",status:200});
                  }
                 }else{
                     res.json({message:"code could not be sent",status:403});
                 }
            }else{
                res.status(403).json({error:"could not update code"});
            }
        }catch(err){
           console.error(err)
        }
        
        
 }
 exports.check_verification_code = async(req,res)=>{
     const get_code = req.body.verifyCode;
     const email = req.body.Email;
        
         try{
               const check_status = await verify_model.findOne({email:email})
               if(check_status.verification_status=="expired" &&  check_status.code==get_code){
                   res.json({message:"verification code has expired",status:405});
               }else{
                const  check_code = await verify_model.findOne({email:email,code:get_code},{code:1})
                if(check_code){
                    const updated = await  verify_model.updateOne({_id:check_code._id},{verification_status:"verified"})
                    if(updated){
                       const update_user = await Users.updateOne({email:email},{verification_status:"verified"})
                        if(update_user){
                            res.json({success:"user has been updates", status:200})
                        }else{
                            res.status(403).json({error:"could not update users"})
                        }
                    }else{
                       res.status(403).json({error:"could not update"})
                    }
                }else{
                    res.status(403).json({message:"code not found"});
                }
               }
            

         }catch(error){
            console.error(error);
         }
         
         
 }
 exports.code_expired=async(req,res)=>{
    const email = req.body.Email;
      try{
       const getId = await verify_model.findOne({email:email},{_id:1})
        if(getId){
              await verify_model.updateOne({_id:getId._id},{verification_status:"expired"})
              .then(updated=>{
                if(updated){
                   res.status(200).json({success:" status updated",status:200});
                }

              }).catch(err=>{
                console.error(err);
              })
        }else{
            res.json({error:"no email found"});
        }
 

      }catch(err){
        console.error(err);
      }
 }
 exports.delete_verification_code = async(req,res)=>{
       const {email} = req.body
        await verify_model.findOneAndDelete(email)
        .then(deleted => {
              if(deleted){
                  res.json({message:"deleted",status:200})
              }else{
                   res.status(403).json({error:'could not delete verification code'});
              }
        }).catch(error=>{
              console.error(error);
        })
 }

 exports.post_password_reset = async(req,res) =>{

   try {
          console.log(req.body)
         
          if(email == ""){
              res.status(500).json({Message:"email field cannot be empty"});
          }else{
                    response.status(200).json({ status:"sucess", message:"  message has been sent to: '"+req.body.email+"'"})

          } 
         
   } catch (error) {
        res.status(500).json({status:"failed", message:error});
   }
 }

 