const Admin_model = require('../models/Admin_model');
 const jwt = require('jsonwebtoken');

 exports.registerAdmin = async(req,res)=>{
      const username = req.body.Username;
      const passsword = req.body.Password;
      try{
         const regUser = await Admin_model.create({username:username,password:passsword})
         if(regUser){
              res.json({message:"User Created"});
         }else{
               res.json({error:"Could not create User"});
         }
      }catch(err){
            res.json({error:err.message});
      }
 }

 exports.admin_login = async(req,res)=>{
    // await Admin_model.create({username,password});
    const username = req.body.Username;
    const password = req.body.Password;
      const get_admin =  await Admin_model.findOne({username:username,password:password})
      if(!get_admin){
            return res.json({error:"User not found",status:403});
      }else{
          console.log(get_admin);
         const Admin_token = jwt.sign({id:get_admin._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});
                         res.cookie("jwt_admin_token",Admin_token,{httpOnly:true,maxAge:36000000});
                         return res.json({token:Admin_token,status:200})

       //  res.json({message:`Welcome ${get_admin.username}`,status:200});
      }
  
 }