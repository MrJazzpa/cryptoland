const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const KycSchema = new Schema({
     userid:{
        type:String,
        require:true
     },
     document_type:{
        type:String,
        require:true
     },
     file:{
        type:String,
        require:true
     },
     Nin:{
          type:String,
          default:"none"

     },
     work_code:{
        type:String,
        default:"none"
     }

})

module.exports = mongoose.model('kycDocument',KycSchema);