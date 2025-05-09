const User = require('../models/signup_model');
const account_model=require('../models/account_model');
const transaction_history_model = require('../models/transaction_history_model');
const investment_model = require('../models/InvestmentPlans_model');
const admin_model = require('../models/Admin_model');

exports.homepage = async(req, res) =>{
    req.session.user = "Helo";
    const locals ={
        title: "crypland-homepage",
        description :" bitcoin cryptoland investment website"
    }

    res.render("index",{locals});
}
exports.staking = async(req, res) =>{

    const locals ={
        title: "staking",
        description :" bitcoin cryptoland investment website"
    }

    res.render("pages/staking",{locals});
}

exports.contact = async(req, res) =>{

    const locals ={
        title: "crypland-contact",
        description :" bitcoin cryptoland investment website"
    }

    res.render("pages/contact",{locals});
}
exports.howtobuy = async(req, res) =>{

    const locals ={
        title: "How-To-Buy",
        description :" bitcoin cryptoland investment website"
    }

    res.render("pages/howtoby",{locals});
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

    res.render("dashboard/pages-signIn",{ locals });
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


 const create_balance = (async function(userid){
    const get_userId = userid
    const find_user =  await account_model.findOne({userid:get_userId})
    if( find_user === null ){
       const  create_acct_balance =await account_model.create({ userid:get_userId,Total_Balance:"0"})
       if(create_acct_balance){
           console.log("balance created");
       }
    }
 })
 
//dashboard
exports.dashboard = async(req,res)=>{
    const locals ={
          title:"Dahsboard"
     }
    const Id= req.user.id;
    try{
         const getuser = await User.findOne({_id:Id});
         if(getuser){
                create_balance(Id);
             res.render("dashboard/index",{locals,getuser});
         }else{
            res.status(400).json({error:"could not find user"});
         }
    }catch(err){
       res.status(400).json({error:err.message})
    }
  // 
}

exports.investmentPlans= async(req,res)=>{
    locals={
        title:"investment Plans"
    }
    const Id= req.user.id;
    try{
         const getuser = await User.findOne({_id:Id});
         if(getuser){
            const getplans = await investment_model.find()
           // console.log(getplans)
            res.render("dashboard/investments",{locals,getuser,getplans});
         }else{
            res.status(400).json({error:"could not find user"});
         }
    }catch(err){
       res.status(400).json({error:err.message})
    }
}
exports.wallet = async(req,res)=>{
    locals={
        title:"investment Plans"
    }
    const Id= req.user.id;
    try{
        
         const getuser = await User.findOne({_id:Id});
         if(getuser){
              await account_model.findOne({userid:getuser._id})
              .then(get_balance=>{
                    res.render("dashboard/wallet",{locals,getuser,get_balance});
              }).catch(err=>{
                    console.log(err.message);
              })
           
         }else{
            res.status(400).json({error:"could not find user"});
         }
    }catch(err){
       res.status(400).json({error:err.message})
    }

}
exports.transaction_history=async(req,res)=>{
    locals={
        title:"Transaction History"
    }
    const Id= req.user.id;
    try{
        const getuser = await User.findOne({_id:Id});
        if(getuser){
            const transaction_history = await transaction_history_model.find({userid:Id});
            res.render("dashboard/transac_history",
                {
                locals,
                getuser,
                transaction_history
            });
        }else{
           res.status(400).json({error:"could not find user"});
        }
   }catch(err){
      res.status(400).json({error:err.message})
   }
  
}
exports.user_profile = async (req,res)=>{
    locals={
        title:"Profile"
    }
    const Id= req.user.id;
    try{
         const getuser = await User.findOne({_id:Id});
         if(getuser){
            res.render('dashboard/pages-profile',{locals,getuser})
         }else{
            res.status(400).json({error:"could not find user"});
         }
    }catch(err){
       res.status(400).json({error:err.message})
    }
    
}
exports.change_password = async(req,res)=>{
    locals={
        title:"Profile"
    }
    const Id= req.user.id;
    try{
         const getuser = await User.findOne({_id:Id});
         if(getuser){
            res.render('dashboard/change_password',{locals,getuser})
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
// ADMIN SECTION

exports.admin_login = async(req,res)=>{
     res.render('admin/Admin-login');
}

exports.AdminDashboard =  async(req,res)=>{
        const id = req.admin.id;
        const local ={
            tittle:"Admin Dashboard"
    }
    try{
    const getAdmin = await admin_model.findOne({_id:id});
     const count = await User.countDocuments()
    if(getAdmin){
        res.render('admin/admin-dashboards.ejs',
            {
                local,
                getAdmin,
                count
            });
    }else{
            res.status(400).json({error:"Could not find user"})
    }

    }catch(err){
        res.status(400).json({error:err.message});
}
}

exports.AllUsers = async(req,res)=>{
         const id = req.admin.id;
         const local ={
                tittle:"Users"
        }
        try{
         const getAdmin = await admin_model.findOne({_id:id});
         const Allusers = await User.find();
        if(getAdmin){
            res.render('admin/all-users',
                {
                    local,
                    getAdmin,
                    Allusers
                    
                });
        }else{
                res.status(400).json({error:"Could not find user"})
        }

        }catch(err){
            res.status(400).json({error:err.message});
        }
}

exports.getUserDetails = async(req,res)=>{
       const user_id = req.query.id;
       const id = req.admin.id;
       const local ={
              tittle:"Users"
      }
      try{
       const getAdmin = await admin_model.findOne({_id:id});
      const user_detail = await User.find({_id:user_id})
      const getbalance = await account_model.find({userid:user_id})
      console.log(user_detail)
       res.render('admin/user-details',
        {
            local,
            getAdmin,
           user_detail,
           getbalance
           
            
        });
     

      }catch(err){
          res.status(400).json({error:err.message});
      }
       

}


exports.admin_logout = async(req,res)=>{
    res.clearCookie("jwt_admin_token");
    res.redirect('/admin-login');
}

