const jwt  = require("jsonwebtoken");


 const verify_ejs_token = (req,res,next) =>{
    
  const token = req.cookies.jwt;
  if(!token){
     return res.redirect("/signin");
  }else{
       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
          if(err){
              return res.redirect("/signin");
          }
          else{
                req.user = decoded;
                next();
          }
       })
  }

   
}   

module.exports = verify_ejs_token;