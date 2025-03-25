const express = require('express');
const router = express.Router();
const api_controller = require("../controller/api_controller");
//const passport = require('passport');
const verifyToken = require('../middleware/verifyToken');
require('../middleware/passport');

router.post('/currentUser',api_controller.currentUser)
router.post("/signup",api_controller.post_signup)
router.post("/signin",api_controller.post_login);
router.post('/resend_verification_code',api_controller.resend_verification_email);
router.post('/check_verification_code',api_controller.check_verification_code);
router.post('/delete_verification_code',api_controller.delete_verification_code);
router.post('/update_code_expired',api_controller.code_expired)
router.post('/PasswordReset',api_controller.post_password_reset)
router.post('/add_value',api_controller.addvalue);
router.post('/update_account',api_controller.update_balance);
router.post('/transaction_history',api_controller.transaction_history);

module.exports = router