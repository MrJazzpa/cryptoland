const jwt  = require("jsonwebtoken");
const verifyToken = (req,res,next)=>{
    const token = req.header("Authorization")?.replace('Bearer ','');;
    if(!token){
        return res.status(401).json({error:"Access denied"});
    }else{
         try{
             const verified = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
             req.user = verified
             console.log(req.header("authorization"));
             next();

         }catch(err){
            res.status(400).json({error:err.message});
         }
    }

}

module.exports = verifyToken;