const express = require('express');
const router = express.Router();
const control_pages = require("../controller/control_pages");
const api_controller = require("../controller/api_controller");
const   verify_ejs_token = require('../middleware/validateTokenHandler')


router.get("/",control_pages.homepage)
router.get("/about",control_pages.about)
router.get("/contact",control_pages.contact)
router.get("/blog",control_pages.blog)
router.get("/signup",control_pages.signup)
router.get("/signin",control_pages.signin)
router.get("/passwordReset",control_pages.reset_password)
router.get("/verificationcode",control_pages.verify_password);
router.get('/status',api_controller.status);


//User Dashboard Routes
router.get ('/dashboard',verify_ejs_token,control_pages.dashboard)
router.get('/logout',control_pages.logout);
 
module.exports = router;