const express = require('express');
const router = express.Router();
const api_controller = require("../controller/api_controller");
const admin_api_controller = require('../controller/admin_api_controller');
const upload = require('../middleware/fileupload');

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
router.post('/deposit_crypto',api_controller.deposit_crypto);
router.post('/approve_payment',api_controller.approve_payment);
router.post('/update_user_info',api_controller.update_user_info);
router.post('/changepassword',api_controller.changepassword);
router.post('/investment_plans',api_controller.Investmen_plans);
router.post('/getinvestment_plan_amount',api_controller.get_investment_plan_amount);
router.post('/upload_documents',upload.single('image'),api_controller.upload_documents);
router.post('/work_code',api_controller.saveWorkCode);
router.post('/Nincode',api_controller.Nincode);
router.post('/bankDetails',api_controller.bankDetails);
//router.post('/investment_history',api_controller.insert_investment_history);

//get methods
router.get('/get_transaction_history/:trnxID',api_controller.Get_trans_history);

//Admin routes
router.post('/admin_register',admin_api_controller.registerAdmin);
router.post('/admin_login',admin_api_controller.admin_login);
router.post('/admin_add_money',admin_api_controller.add_money);

module.exports = router