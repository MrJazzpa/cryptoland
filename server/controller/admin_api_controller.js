const Admin_model = require('../models/Admin_model');
const Account_model = require('../models/account_model');
 const jwt = require('jsonwebtoken');
 const transporter = require('../middleware/sendmail');
  
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
 exports.add_money = async(req,res)=>{
     const userid = req.body.UserId;
     const email = req.body.Email
     const subject = "Deposit";
     
     const Amount = parseFloat(req.body.Amount);
      try{
         const quick_text = `$${Amount.toLocaleString('en-Us',{minimumFractionDigits:2})} has been deposited to your Account`
         const   get_deposit_balance = await Account_model.findOne({userid:userid},{Deposit_Balance:1});
         const  initial_amount = parseFloat(get_deposit_balance.Deposit_Balance.replace(/,/g,""));
         const final_balance = initial_amount+Amount;
         const update_result= await Account_model.updateOne({userid:userid},{Deposit_Balance:final_balance});
         if(update_result){
            sendmail(process.env.EMAIL,email,subject,quick_text);
             res.json({message:"Account has been updated"});
         }else{
              res.json({error:"Could not update account"})
         }
      }catch(err){
          res.json({error:err.message});
      }



 }
 