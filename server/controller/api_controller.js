const Users = require('../models/signup_model');
const bcrypt = require('bcryptjs');
const transporter = require('../middleware/sendmail');
const verify_model = require('../models/verificationCode_model');
 const jwt = require('jsonwebtoken');
const account_model = require('../models/account_model');
const deposite_model =require('../models/depositedMoney_model');
const transaction_history_model = require('../models/transaction_history_model');
const investment_model = require('../models/InvestmentPlans_model');
const investment_history = require('../models/investment_history');
const Admin_model = require('../models/Admin_model');
const kyc_document_model = require('../models/kyc_document_upload');
const bank_model = require('../models/bank_model');
const { json } = require('express');
const { parse } = require('dotenv');

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
 const verify_code = Code.toString();
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
     const total = req.body.Total_amount
     const btc_price = req.body.btc_price;
     const eth_price = req.body.eth_price;
     const doge_price = req.body.doge_price;
     const usdt_price = req.body.usdt_price
     const userId = req.body.UserId;
      const totalformatted= parseFloat(total.replace(/,/g,""));
      const check_user = await account_model.find({userid:userId},{Total_Balance:1,userid:1})
      if(check_user.userid!=""){
          // let total_balance=  parseFloat(check_user.Total_Balance.replace(/,/g,""));
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
              
               const initialBalance = parseFloat(get_balance.Total_Balance.replace(/,/g,""));
               const initBtc = parseFloat(get_balance.Btc_Amount.replace(/,/g,""));
               const initEth =parseFloat(get_balance.Ethereum_Amount.replace(/,/g,""));
               const initUsdt = parseFloat(get_balance.Usdt_Amount.replace(/,/g,""));
               const initDoge = parseFloat(get_balance.Doge_Amount.replace(/,/g,""));
                const finalbtc= Btc_Amount+initBtc;
                const finaleth = Ethereum_Amount+initEth;
                const finaldoge = Doge_Amount+initDoge;
                const finalusdt = Usdt_Amount+initUsdt
                 const finaltotal = finalbtc+finaleth+finaldoge+finalusdt
                const Total_Balance = finaltotal+initialBalance;
                //const maintotal =finaltotal+Total_Balance
                 
               const update_account= await account_model.updateOne({userid:userid},{Btc_Amount:finalbtc.toLocaleString('en-Us',{minimumFractionDigits:2}),Ethereum_Amount:finaleth.toLocaleString('en-Us',{minimumFractionDigits:2}),Doge_Amount:finaldoge.toLocaleString('en-Us',{minimumFractionDigits:2}),Usdt_Amount:finalusdt.toLocaleString('en-Us',{minimumFractionDigits:2}),Total_Balance:Total_Balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                if(update_account){

                    const getemail = await Users.findOne({_id:userid},{email:1})
                    const text = `$${Total_Balance.toLocaleString('en-us',{minimumFractionDigits:2})} has been deposited to your Wallet\n\n Thanks For Your Smart Investment Choice`
                     const subject= "CREDIT"
                    sendmail(process.env.EMAIL,getemail,subject,text);
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

  exports.deposit_crypto = async(req,res)=>{
      const amount = req.body.Amount;
      const crypto_amount = req.body.crypto_Amount;
      const Deposit_type = req.body.Deposit_type
      const Deposit_Crypto_Coin = req.body.Deposit_Crypto_Coin;
      const userid = req.body.Userid;
      console.log(userid)
       const result=generateRandomString(25)
       try{
        const deposit = await transaction_history_model.create({userid:userid,transactionId:result,amount:amount,deposit_type:Deposit_type,crypto_coin:Deposit_Crypto_Coin,crypto_amount:crypto_amount})
        if(deposit){
            res.json({message:"success",status:200});
        }else{
             res.json({message:"Could not insert deposit"});
        }
       
       }catch(err){
          res,json({error:err.message})
       }

     
  }

 exports.approve_payment = async(req,res)=>{
    let status ="";
    let deposite_balance=0;
    let Btc_Amount="";
    let Ethereum_Amount =0;
    let Usdt_Amount =0;
    let Doge_Amount =0;
    let crypto_amount =0;
    let Amount=0;
    let crypto_type="";
    let  userid = req.body.userId;
    let  get_trnx_id = req.body.trnxId;
    let getdetails="";
    let  changestatus =    async function changeStatus(){
        await transaction_history_model.updateOne({userid:userid,transactionId:get_trnx_id},{status:status})
    }
    const SendMail = async function(){
        const getemail = await Users.findOne({_id:userid},{email:1})
        const text = `$${getdetails[0].amount.toLocaleString('en-Us',{minimumFractionDigits:2})} Worth of ${crypto_type} has been deposited to your Wallet\n\n Thanks For Your Smart Investment Choice`
        const subject=`${crypto_type} CREDIT`
        sendmail(process.env.EMAIL,getemail,subject,text);
    }
   try{
         getdetails =  await transaction_history_model.find({userid:userid,transactionId:get_trnx_id});
        const get_data_in_account= await account_model.find({userid:userid});
          Amount = parseFloat(getdetails[0].amount.replace(/,/g,""))
        crypto_amount = parseFloat(getdetails[0].crypto_amount);
         crypto_type = getdetails[0].crypto_coin;
        const deposit_type = getdetails[0].deposit_type

          status = "success"  
         // varaibles fo data in account
         deposite_balance = parseFloat(get_data_in_account[0].Deposit_Balance.replace(/,/g,""))
         Btc_Amount = parseFloat(get_data_in_account[0].Btc_Amount.replace(/,/g,""))
         Ethereum_Amount = parseFloat(get_data_in_account[0].Ethereum_Amount.replace(/,/g,""));
         Usdt_Amount = parseFloat(get_data_in_account[0].Usdt_Amount.replace(/,/g,""));
         Doge_Amount = parseFloat(get_data_in_account[0].Doge_Amount.replace(/,/g,""));
        // const crypto_balance = parseFloat(get_data_in_account.crypto_amount)
         const final_balance = Amount+deposite_balance;
         if(deposit_type == "Deposit"){
            changestatus()
            if(changestatus){
                await account_model.updateOne({userid:userid},{Deposit_Balance:final_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                const getemail = await Users.findOne({_id:userid},{email:1})
                const text = `$${getdetails[0].amount.toLocaleString('en-us',{minimumFractionDigits:2})} has been deposited to your Wallet\n\n Thanks For Your Smart Investment Choice`
                 const subject= "CREDIT"
                sendmail(process.env.EMAIL,getemail,subject,text);
                return res.json({success:"transaction status updated ",status:200})
            }

         }else if(deposit_type=="Crypto"){
            switch (crypto_type){
                case "BTC":
                    const new_btc = Btc_Amount+Amount
                    const new_balance= deposite_balance+Amount;
                     changestatus()
                  if(changestatus){
                       await account_model.updateOne({userid:userid},{Btc_Amount:new_btc.toLocaleString('en-Us',{minimumFractionDigits:2}),Deposit_Balance:new_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                       SendMail();
                      return  res.json({success:"success", status:200});
                  }else{
                      return  res.json({error:"payment could not be approved"});
                  }
                 
                 
                case "ETH":
                    const new_eth = Ethereum_Amount+Amount
                    const getnew_balance= deposite_balance+Amount;
                    changestatus()
                    if(changestatus){
                         await account_model.updateOne({userid:userid},{Ethereum_Amount:new_eth.toLocaleString('en-Us',{minimumFractionDigits:2}),Deposit_Balance:getnew_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                         SendMail();
                         return  res.json({success:"success", status:200});
                    }else{
                        return  res.json({error:"payment could not be approved"});
                    }
                   // return res.json({Ethereum_amount:Ethereum_Amount,Amount:Amount,Deposit_Balance:deposite_balance,final_balance:getnew_balance})

                case "DOGE":
                    const new_doge = Doge_Amount+Amount
                    const getdoge_balance= deposite_balance+Amount;
                    changestatus()
                    if(changestatus){
                         await account_model.updateOne({userid:userid},{Doge_Amount:new_doge.toLocaleString('en-Us',{minimumFractionDigits:2}),Deposit_Balance:getdoge_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                         SendMail();
                         return  res.json({success:"success", status:200});
                    }else{
                        return  res.json({error:"payment could not be approved"});
                    }
                    
                case "USDT":
                    const new_usdt = Usdt_Amount+Amount
                    const usdt_balance= deposite_balance+Amount;
                    changestatus()
                    if(changestatus){
                         await account_model.updateOne({userid:userid},{Usdt_Amount:new_usdt.toLocaleString('en-Us',{minimumFractionDigits:2}),Deposit_Balance:usdt_balance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                         SendMail();
                         return  res.json({success:"success", status:200});
                    }else{
                        return  res.json({error:"payment could not be approved"});
                    }
                default:
                   return res.json({error:`none of the options are met for type ${crypto_type}`});
            }
           
                 
         }else{
            return  res.json({error:"None of the Options are met"})
         }

   //  res.json({data_in_history:getdetails, data_in_account:get_data_in_account[0], final_balance:final_balance});
   

   }catch(err){
      return res.json({error:err.message});
   }
 }

 exports.update_user_info = async(req,res)=>{
        
    const userid = req.body.Userid;
    const phoneNumber = req.body.phoneNumber;
    const country = req.body.Country;
    const state = req.body.State;
    const dob = req.body.DOB;
    const address =req.body.Address;
     try{

          const update_info = await Users.updateOne({_id:userid},{phone_number:phoneNumber,country:country,state,state,dob:dob,address:address});
          if(update_info){
            res.json({message:"success",status:200})
          }else{
               res.json({error:"could not update Users"})
          }
     

     }catch(err){
        res.json({error:err.message});
     }

 }

 exports.changepassword = async(req,res)=>{
        const Oldpass = req.body.Oldpass;
        const Newpass = req.body.Newpass;
        const Compass = req.body.Compass;
        const userid = req.body.UserId;
        console.log(req.body);
         if(Compass!=Newpass){
            res.json({error:"Password does not match",status:403})
         }else{
            try{
                const getuser = await Users.findOne({_id:userid});
                if(!getuser){
                    res.json({error:"user not found"});
               }else{
                   const isMatch = await bcrypt.compare(Oldpass,getuser.password);
                   if(isMatch){
                        const hash = await bcrypt.genSalt(15);
                        const hashedpassword = await bcrypt.hash(Newpass,hash);
                        await Users.updateOne({_id:userid},{password:hashedpassword});
                        res.json({message:"Password Updated Successfully",status:200})
    
                   }
               }
            }catch(err){
                res.json({error:err.message})
            }
         }
        
 }

 // upload investment plan from admin
 exports.Investmen_plans = async(req,res)=>{
      const plan = req.body.Plan;
      const percentage =  req.body.Percentage
      const times =  req.body.Times;
      const minAmount = req.body.MinAmount;
      const maxAmount = req.body.MaxAmount;
      if(plan=='Basic Plan' || plan=="Standard Plan" || plan=="Premium Plan"){
        try{
               const getplan = await investment_model.findOne({plan:plan},{plan:1})
               if(getplan){
                return res.json({message:`${getplan.plan} Aleady Exists`,status:400});
           }else{
                    const plans = await investment_model.create({plan:plan,percentage:percentage,times:times,min_amount:minAmount,max_amount:maxAmount})
                    if(plans){
                       return res.json({message:`${plan} Created`,status:200})
                    }
           }
         }catch(err){
                return res.json({error:err.message});
         }
      
      }else{
        res.status(405).json({info:"invetsment plan must be Basic,Standard or Premium",status:405});
      }  

 }
 
 exports.get_investment_plan_amount = async(req, res)=>{
    const userid = req.body.Userid;
    const min_amount = req.body.Min_amount;
    const max_amount = req.body.Max_amount;
    const plan_amount = parseFloat(req.body.Amount_plan);
    const plan = req.body.Plan;
    const Times = req.body.Times;
    const percentage_return = req.body.Percentage_return
      const getemail = await Users.findOne({_id:userid});
      const email = getemail.email;
      const Subject="Investment";
       const text = `Hello! ${getemail.name}\n\n Your Investment Has Been Made Successfully. \n\n Please Refresh Your Dasboard to View Investments`;
    try{

           const get_deposit_balance = await account_model.findOne({userid:userid},{Deposit_Balance:1,Total_Balance:1});
            const get_min_amount = await investment_model.findOne({plan:plan});
            const depositBalance = get_deposit_balance.Deposit_Balance.replace(/,/g,"");
           const finaldeposit = parseInt(depositBalance)
            const MinAmount = parseInt(get_min_amount.min_amount);
            const MaxAmount= parseInt(get_min_amount.max_amount);
            const  get_total_balance =  parseFloat(get_deposit_balance.Total_Balance.replace(/,/g,""));
             const insertData = async function(){
                const update_total = get_total_balance+plan_amount;
                const insertdata =({userid:userid,plan:plan,investmentAmount:plan_amount,number_times:Times,Percentage_return:percentage_return})
                const insert_history = await investment_history.create(insertdata);
                 
                if(insert_history){
                  const  planAmount = parseInt(plan_amount)
                   const newbalance = finaldeposit - planAmount;
                    await account_model.updateOne({userid:userid},{Total_Balance:update_total.toLocaleString('en-Us',{minimumFractionDigits:2}),Deposit_Balance:newbalance.toLocaleString('en-Us',{minimumFractionDigits:2})})
                    sendmail(process.env.EMAIL,email,Subject,text);
                  res.json({messages:"Investment Successfull",status:200})
                }
             }
            if(finaldeposit>=min_amount|| finaldeposit>=max_amount){
                switch(get_min_amount.plan){
                    case "Basic Plan":
                        if(plan_amount>MaxAmount){
                               res.json({error:`Exceeded maximum amount for ${get_min_amount.plan}`,status:400})
                        }else{
                            
                           insertData();
                        }
                        break;
                        case "Standard Plan":
                            if(plan_amount>MaxAmount){
                                   res.json({error:`Exceeded maximum amount for ${get_min_amount.plan}`,status:400})
                            }else{
                                
                               insertData();
                            }
                            break;
                        case "Premium Plan":
                                if(plan_amount>MaxAmount){
                                       res.json({error:`Exceeded maximum amount for ${get_min_amount.plan}`,status:400})
                                }else{
                                    
                                   insertData()
                                }
                                 break;
                        default:
                            res.json({error:"No plan found"})
                }
            
            }else{
                 res.json({error:"You do not have money to make this investment  ",status:400});
            }
    }catch(err){
       res.json({error:err.message});
    }


}

exports.upload_documents = async(req,res)=>{
    const userid = req.body.userid;
     const value_type = req.body.value_type;
      const file = req.file.filename;
      try{

           const send_document = await kyc_document_model.create({userid:userid,document_type:value_type,file:file})
           if(send_document){
                    res.json({success:"Your Document has been uploaded Please Wait For Verification"});
           }else{
                    res.json({error:"Could Not Upload Document"});
           }

      }catch(err){
          res.json({error:err.message});
      }
      
}

exports.saveWorkCode = async(req,res)=>{
     const code = req.body.Code;
     const userid = req.body.userid
     try{
        const result = await kyc_document_model.updateOne({userid:userid},{work_code:code});
        if(result){
            res.json({success:"Your Document has been uploaded Please Wait For Verification"})
        }else{
            res.json({error:"Could Not Upload Document"});
        }
  }catch(error){
     res.status(500).json({error:error.message})
  }
     
}
 exports.Nincode = async(req,res)=>{
    const code = req.body.Code;
    const userid = req.body.userid
    try{
       const result = await kyc_document_model.updateOne({userid:userid},{Nin:code});
       if(result){
           res.json({success:"Your Document has been uploaded Please Wait For Verification"})
       }else{
        console.log("not working")
           res.json({error:"Could Not Upload Document"});
       }
 }catch(error){
    console.log(error.message)
    res.status(500).json({error:error.message})
 }
 }

 exports.bankDetails = async(req,res)=>{
      const userid = req.body.userid;
      const acct_num = req.body.acct_num;
      const acct_name = req.body.acct_name;
      const bank_name = req.body.bank_name;
       try{
        const saveBank = await bank_model.create({userid:userid,account_number:acct_num,account_name:acct_name,bank_name:bank_name});
        if(saveBank){
         res.json({success:`Money will be sent to ${acct_num}, please make sure the name of the account corresponds with the name on your profile  `})
        }else{
            res.json({success:"Saving bank details failed"})
        }
       }catch(err){
            res.status(500).json({error:err.message})
       }
 }

exports.insert_investment_history = async(req,res)=>{
    res.json('wprked')
}
  //GET Methods

  exports.Get_trans_history = async(req,res)=>{
      const get_trnx_id = req.params.trnxID;
       try{
        const result= await transaction_history_model.find({transactionId:get_trnx_id})
        res.json({dataResult:result,status:200});
       }catch(err){
        res.json({error:err.message})
       }
       
  }

