const User = require('../models/signup_model');

exports.homepage = async(req, res) =>{
    req.session.user = "Helo";
    const locals ={
        title: "crypland-homepage",
        description :" bitcoin cryptoland investment website"
    }

    res.render("index",{locals});
}
exports.about = async(req, res) =>{

    const locals ={
        title: "crypland-about",
        description :" bitcoin cryptoland investment website"
    }

    res.render("pages/about-us",{locals});
}

exports.contact = async(req, res) =>{

    const locals ={
        title: "crypland-contact",
        description :" bitcoin cryptoland investment website"
    }

    res.render("pages/contact",{locals});
}
exports.blog = async(req, res) =>{

    const locals ={
        title: "crypland-blog",
        description :" bitcoin cryptoland investment website"
    }

    res.render("pages/blog",{locals});
}

//Authentication

exports.signup = async(req, res) =>{
  
    const locals ={
        title: "signup",
        description :" bitcoin cryptoland investment website"
    }

    res.render("dashboard/pages-signUp",{locals});
}
exports.signin = async(req, res) =>{
  
    const locals ={
        title: "Signin",
        description :" bitcoin cryptoland investment website",
        
    }

    res.render("dashboard/pages-signin",{ locals });
}
exports.verify_password = async(req,res)=>{
    const locals ={
        tittle: "reset password"
     }
     res.render('dashboard/verify-code',{locals});
}
exports.reset_password= async(req,res) =>{
     const locals ={
        tittle: "reset password"
     }
     res.render('pages/reset-password',{locals});
}




//dashboard
exports.dashboard = async(req,res)=>{
    const locals ={
          title:"Dahsboard"
     }
    const Id= req.user.id;
    try{
         const getuser = await User.findOne({_id:Id});
         if(getuser){
            res.render("dashboard/index",{locals,getuser});
         }else{
            res.status(400).json({error:"could not find user"});
         }
    }catch(err){
       res.status(400).json({error:err.message})
    }
  // 
}
 const get_user_id= async function(req,res,Id, next){
    const user_id = Id;
    const newuser= await User.findOne({_id:id})
     req.newUser = newuser
     
 }
exports.investmentPlans= async(req,res)=>{
    locals={
        title:"investment Plans"
    }
    const Id= req.user.id;
    try{
         const getuser = await User.findOne({_id:Id});
         if(getuser){
            res.render("dashboard/investments",{locals,getuser});
         }else{
            res.status(400).json({error:"could not find user"});
         }
    }catch(err){
       res.status(400).json({error:err.message})
    }
}
exports.logout = async(req,res)=>{
    res.clearCookie("jwt");
    res.redirect('/signin');
}


