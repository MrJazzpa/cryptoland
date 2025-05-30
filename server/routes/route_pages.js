const express = require('express');
const router = express.Router();
const control_pages = require("../controller/control_pages");
const api_controller = require("../controller/api_controller");
const   verify_ejs_token = require('../middleware/validateTokenHandler')
const veryify_admin_token = require('../middleware/verify_admin_token');
const verify_admin_token = require('../middleware/verify_admin_token');


router.get("/",control_pages.homepage)
router.get("/staking",control_pages.staking)
router.get("/contact",control_pages.contact)
router.get("/howtobuy",control_pages.howtobuy)
router.get("/signup",control_pages.signup)
router.get("/signin",control_pages.signin)
router.get("/passwordReset",control_pages.reset_password)
router.get("/verificationcode",control_pages.verify_password);
router.get('/status',api_controller.status);


//User Dashboard Routes
router.get('/getLocation',control_pages.getLocation);
router.get ('/dashboard',verify_ejs_token,control_pages.dashboard)
router.get('/investments',verify_ejs_token,control_pages.investmentPlans)
router.get('/wallet',verify_ejs_token,control_pages.wallet)
router.get('/transaction_history',verify_ejs_token,control_pages.transaction_history)
router.get('/user-profile',verify_ejs_token,control_pages.user_profile)
router.get('/changepassword',verify_ejs_token,control_pages.change_password);
router.get('/kyc', verify_ejs_token,control_pages.kyc);
router.get('/logout',control_pages.logout);


// Admin routes
router.get('/admin-login',control_pages.admin_login);
router.get('/admin_logout',control_pages.admin_logout);
router.get('/admin-dashboard',veryify_admin_token,control_pages.AdminDashboard);
router.get('/users',verify_admin_token,control_pages.AllUsers);
router.get('/user-details',verify_admin_token,control_pages.getUserDetails)
router.get('/admin-kyc',verify_admin_token,control_pages.adminkyc)
module.exports = router;