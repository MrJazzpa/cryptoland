const isPasswordCorrect = await bcrypt.compare(password,Users.password);
     if(!isPasswordCorrect){
        return res.status(402).json({message:'invalid email or password'});

     }else{
           const accessToken = jwt.sign({

              user:{
                    name: Users.name,
                    email: Users.email,
                    id: Users.id
              }, 

        },
        process.env.ACESS_TOKEN_SECRET,
        {expiresIn:"1m"}
      );
        res.status(200).json({acessToken});
     }

     

     const validateToken = async(req,res) =>{
         let token ;
         let authHeader =  req.headers.Authorization || req.headers.authorization
         if(authHeader && authHeader.startsWith("Bearer")){
              token = authHeader.split("")[1];
              jwt.verify(token,process.env.ACESS_TOKEN_SECRET,(err,decoded)=>{
     
                 if(err){
                     res.status(400).json({error:"User is not authorised"});
                 }
                 console.log(decoded);
     
              });
         }
     }
     if(decoded){
      const userEmail = decoded.user.email;
      const user = await Users.findOne({email:userEmail});
      if(user){
           res.status(200).json({message:`welcome ${user.name}`});
      }else{
            res.status(400).json({error:"details could not be found"});
      }
     // res.status(200).json({decoded});
  } 


  //authenticate user
   validateToken = async(req,res,next) =>{
     const token = req.headers.authorization.split(" ")[1];
     const mysecretkey = process.env.ACESS_TOKEN_SECRET;
     try{
  
          const decoded = jwt.verify(token,mysecretkey);
          if(!decoded){
            
              res.status(400).json({message:"Unauthorized"})
          }
          req.user = decoded;
          next();
         
  
     }catch(error){
      res.status(401).json({error:"Invalid token"});
     }
  }


  email =  getDetails.user.email
  try{
   const user =  await Users.findOne({email:email})
   if(user){
       res.status(200).json({message: `${user.name}`})
      // res.redirect('/dashboard');
   }
  }catch(error){
      res.status(400).json({Message:"Not Authorised current User"})
  }


   validateToken = async(req,res,next) =>{
      let token ;
      const mysecretkey = process.env.ACESS_TOKEN_SECRET;
      let authHeader = req.headers.Authorization || req.headers.authorization;
      if(authHeader && authHeader.startsWith("Bearer")){
         token = authHeader.split(" ")[1];
         jwt.verify(token,mysecretkey,(err,decoded)=>{
             if(err){
                console.log("user not authorised")
                res.status(401).json({message:"User not Authorized"})
             }
             req.user=decoded.user;
             next();
         });
         if(!token){
          console.log("token missing")
            res.status(400).json({message:"Token is missing in the request"})
         }
      }
  }




  let token ;
      const mysecretkey = process.env.ACESS_TOKEN_SECRET;
      let authHeader = req.headers.Authorization || req.headers.authorization;
      if(authHeader && authHeader.startsWith("Bearer")){
         token = authHeader.split(" ")[1];
         jwt.verify(token,mysecretkey,(err,decoded)=>{
             if(err){
                console.log("user not authorised")
                res.status(401).json({message:"User not Authorized"})
             }
             req.user=decoded.user;
             next();
         });
         if(!token){
          console.log("token missing")
            res.status(400).json({message:"Token is missing in the request"})
         }
      }


      let authHeader = req.headers.Authorization || req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1]
    
      if (token == null) return res.sendStatus(401)
    
      jwt.verify(token, process.env.mysecretkey, (err,decoded) => {
        console.log(err)
    
        if (err) return res.sendStatus(403)
    
        req.user = decoded
    
        next()
      })




      onst authHeader = req.headers.Authurization;
 if(!authHeader || !authHeader.startsWith("Bearer ")){
       return res.status(401).json({success:false, message:"Invalid Authorization header"});
 }
  const token = authHeader.replace("Bearer ","")
if(!token){
   return res.status(401).json({success:false, message:"Authorization token not found"});

}
 try{
      const decoded = jwt.verify(token,process.env.ACESS_TOKEN_SECRET)
      req.user = decoded.user;
      next();
 }catch(err){
   console.error(err);
   return res.status(401).json({ success: false, message: "Invalid token" });

 }




 
 const authHeader = req.headers.authorization;
 if(!authHeader || !authHeader.startsWith("Bearer ")){
       return res.status(401).json({success:false, message:"Invalid Authorization header"});
 }
  const token = authHeader.replace("Bearer ","")
if(!token){
   return res.status(401).json({success:false, message:"Authorization token not found"});

}
 try{
      const decoded = jwt.verify(token,process.env.ACESS_TOKEN_SECRET,decoded)
      req.user = decoded.user;
      next();
 }catch(err){
   console.error(err);
   return res.status(401).json({ success: false, message: "Invalid token" });
 }



  exports.post_login = async(req,res) =>{
 
      const { email, password } = req.body;
 
       if(!email || !password){
         return  res.status(400).json({message:"all fields must be filled"});
         
       }
      const user = await Users.findOne({email});
      if(!user){
         return res.status(402).json({message:'Invalid email'})
      }
      // check if password is correct 
 
      if(user && (await bcrypt.compare(password,user.password ))){
 
         const accessToken = jwt.sign({
 
             user:{
                   name: user.name,
                   email: user.email,
                   id: user._id
             }, 
 
       },
       process.env.ACESS_TOKEN_SECRET,
       {expiresIn:"15m"}
     );
        //res.status(200).json({accessToken})
        console.log(accessToken);
        return res.redirect('/User');
      }else{
          res.status(400).json({message:"incorrect user / password"})
      }
  
  }


  exports.post_login = async(req,res) =>{
  
       const { email, password } = req.body;
  
        if(!email || !password){
          return  res.status(400).json({message:"all fields must be filled"});
          
        }
       const user = await Users.findOne({email});
       if(!user){
          return res.status(402).json({message:'Invalid email'})
       }
       // check if password is correct 
  
       if(user && (await bcrypt.compare(password,user.password ))){
  
          const accessToken = jwt.sign({
  
              user:{
                    name: user.name,
                    email: user.email,
                    id: user._id
              }, 
  
        },
        process.env.ACESS_TOKEN_SECRET,
        {expiresIn:"15m"}
      );
         //res.status(200).json({accessToken})
         console.log(accessToken);
         return res.redirect('/User');
       }else{
           res.status(400).json({message:"incorrect user / password"})
       }
   
   }


   exports.signup = async(req, res) =>{
      if(req.session.nam){
        res.status(200).json({message:"session available"})
      }
       const locals ={
           title: "signup",
           description :" bitcoin cryptoland investment website"
       }
   
       res.render("pages/signup",{locals});
   }
   exports.signin = async(req, res) =>{
        
       const locals ={
           title: "Signin",
           description :" bitcoin cryptoland investment website"
       }
   
       res.render("pages/signin",{locals});
   }



   exports.post_signup = async(req, res) =>{
   
       console.log(req.body);
   
   
      if(req.body.password == req.body.con_password){
   
   
       const {name,email,password}=req.body;
        try {
            //check if user already exists before registring 
            const existingUser = await Users.findOne({email});
            if(existingUser){
               return res.status(409).json({error:existingUser.email});
   
            }
            // hash password
           const salt = await bcrypt.genSalt(15);
           const hashedpassword = await bcrypt.hash(password,salt);
           
           //create new user
           const newUsers =({name,email,password:hashedpassword});
            await Users.create(newUsers)
       
             res.redirect('/signin');
   
   
   
        } catch (error) {
           res.status(500).json({message:error})
           console.log(error);
        }
   
      }else{
          return  res.status(500).json({message:"password does not match"})
          // console.log("passwords did not match");
      }
    
        
    }



         await verify_model.findOne({email:email,code:get_code},{code:get_code})
         .then(async() =>{
            const updated = await verify_model.findOneAndUpdate({email:email},{verification_status:"verified"});
            if(updated){
                res.status(200).json({data:"success",status:200});
            }else{
                res.status(200).json({error:"could not updated"});
            }
         
    
         }).catch(err=>{
               res.status(400).json({error:err.message})
         })








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






/////// sign in code

                      try{
                                 const user = await Users.findOne({email:email});
                                 if(!user){
                                     return res.status(400).json({error:"User not found",status:400});
                                 }else{
                                     const isMatch = await bcrypt.compare(password,user.password);
                                     if(!isMatch){
                                         return res.status(400).json({error:"Invalid Credentials",status:400});
                                     }else{
                                         const token = jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"});
                                         return res.status(200).json({token,status:200})
                                     }
                                 }
                           }catch(err){
                               return res.status(400).json({error:err.message})
                           }




                           const Id= req.user.id;
                           try{
                                const getuser = await User.findOne({_id:Id});
                                if(getuser){
                                   res.render("dashboard/index",{locals,getuser});
                                  // res.status(200).json({data:getuser})
                                }else{
                                   res.status(400).json({error:"could not find user"});
                                }
                           }catch(err){
                              res.status(400).json({error:err.message})
                           }







     const check_user = await account_model.findOne({userid:userId})
      if(check_user.userid!=""){
           const update = await account_model.updateOne({userid:userId},{Btc_Amount:btc_price,Ethereum_Amount:eth_price,Doge_Amount:doge_price,Usdt_Amount:usdt_price,Total_Balance:total})
           if(update){
            res.json({success:"successfull",status:200});
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



     