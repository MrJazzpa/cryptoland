const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VerificationSchema = new Schema({
    code:{
        type:String,
        required:true
    },
    email:{
         type:String,
         required:true
    },
    verification_status:{
        type:String,
        default:"not expired"
    }
    
})

module.exports = mongoose.model('verificationCode',VerificationSchema);