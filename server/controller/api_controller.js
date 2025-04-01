const Users = require('../models/signup_model');
const bcrypt = require('bcryptjs');
const transporter = require('../middleware/sendmail');
const verify_model = require('../models/verificationCode_model');
 const jwt = require('jsonwebtoken');
const account_model = require('../models/account_model');
const deposite_model =require('../models/depositedMoney_model');
const transaction_history_model = require('../models/transaction_history_model');
const { json } = require('express');
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
                        //const create_account_balance =await account_model.create(us)
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

 exports.addvalue = async(req,res)=>{
     const total = req.body.Total_amount;
     const btc_price = req.body.btc_price;
     const eth_price = req.body.eth_price;
     const doge_price = req.body.doge_price;
     const usdt_price = req.body.usdt_price
     const userId = req.body.UserId;
      const totalformatted= total.toLocaleString();
      const check_user = await account_model.findOne({userid:userId})
      if(check_user.userid!=""){
           const update = await account_model.updateOne({userid:userId},{Btc_Amount:btc_price,Ethereum_Amount:eth_price,Doge_Amount:doge_price,Usdt_Amount:usdt_price,Total_Balance:totalformatted})
           if(update){
                const get_account_balance = await account_model.findOne({userid:userId},{Total_Balance:1})
                console.log(get_account_balance.Total_Balance)
               res.json({currentBalance:get_account_balance.Total_Balance,status:200});
           }
      }else{
        await account_model.create({userid:userId,Btc_Amount:btc_price,Ethereum_Amount:eth_price,Doge_Amount:doge_price,Usdt_Amount:usdt_price,Total_Balance:total})
       .then(result=>{
        if(result){
           res.json({success:"successfull",status:200});
        }else{
           res.json({success:"failed",status:401});
        }
     }).catch(err=>{
           res.status(400).json({error:err.message});
     })
      }
     
 }

 exports.update_balance = async(req,res)=>{
       const userid = req.body.UserId;
       const Btc_Amount = parseFloat(req.body.Btc_Amount);
       const Ethereum_Amount = parseFloat(req.body.Ethereum_Amount);
       const Doge_Amount = parseFloat(req.body.Doge_Amount);
       const Usdt_Amount = parseFloat(req.body.Usdt_Amount);
      // const add_balance = Btc_Amount+Ethereum_Amount+Doge_Amount+Usdt_Amount
       try{
             const get_balance = await account_model.findOne({userid:userid});
               const initialBalance = parseFloat(get_balance.Total_Balance);
               const initBtc = parseFloat(get_balance.Btc_Amount);
               const initEth =parseFloat(get_balance.Ethereum_Amount);
               const initUsdt = parseFloat(get_balance.Usdt_Amount);
               const initDoge = parseFloat(get_balance.Doge_Amount);
                const finalbtc= Btc_Amount+initBtc;
                const finaleth = Ethereum_Amount+initEth;
                const finaldoge = Doge_Amount+initDoge;
                const finalusdt = Usdt_Amount+initUsdt
                 const finaltotal = finalbtc+finaleth+finaldoge+finalusdt
                const Total_Balance = finaltotal+initialBalance;
                //const maintotal =finaltotal+Total_Balance
                
               const update_account= await account_model.updateOne({userid:userid},{Btc_Amount:finalbtc.toLocaleString('en-Us',{minimumFractionDigits:2}),Ethereum_Amount:finaleth.toLocaleString('en-Us',{minimumFractionDigits:2}),Doge_Amount:finaldoge.toLocaleString('en-Us',{minimumFractionDigits:2}),Usdt_Amount:finalusdt.toLocaleString('en-Us',{minimumFractionDigits:2}),Total_Balance:Total_Balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                if(update_account){
                    res.json({success:"updated",status:200})
                }else{
                    res.json({error:"could not update"})
                }
             
         
       }catch(err){
            res.json({error:err.message});
       }
 
  }
   function generateRandomString(length){
    const chars = process.env.TRANSACTION_TOKEN
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result
   }
  exports.transaction_history = async(req,res)=>{
         const result =generateRandomString(25)
     try{
        const userid = req.body.UserId;
        const amount = req.body.Amount;
        const insert_transaction = await transaction_history_model.create({userid:userid,transactionId:result,amount:amount})
        if(insert_transaction){
            res.json({data:"success",tID:result,status:200});
        }else{
            res.json({error:"failed to insert transaction"})
        }
     }catch(err){
        res.json({error:err.message})
     }

  }

  exports.deposit_btc = async(req,res)=>{
      const amount = req.body.Amount;
      const btc_amount = req.body.Btc_Amount;
      const Deposit_type = req.body.Deposit_type
      const Deposit_Crypto_Coin = req.body.Deposit_Crypto_Coin;
      const userid = req.body.Userid;
      console.log(userid)
       const result=generateRandomString(25)
       try{
        const deposit = await transaction_history_model.create({userid:userid,transactionId:result,amount:amount,deposit_type:Deposit_type,crypto_coin:Deposit_Crypto_Coin,crypto_amount:btc_amount})
        if(deposit){
            res.json({message:"success",status:200});
        }else{
             res.json({message:"Could not insert deposit"});
        }
       
       }catch(err){
          res,json({error:err.message})
       }

     
  }


  //GET Methods

  exports.Get_trans_history = async(req,res)=>{
      const get_trnx_id = req.params.trnxID
       try{
        const result= await transaction_history_model.find({transactionId:get_trnx_id})
        res.json({dataResult:result,status:200});
       }catch(err){
        res.json({error:err.message})
       }
       
  }