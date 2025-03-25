 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 const TransactionSchema = new Schema({
     userid:{
        type:String,
        require:true
     },
     transactionId:{
        type:String,
        require:true
     },
     amount:{
        type: String,
        require:true
     },
     receipt:{
        type:String,
        require:false,
        default:"No image"
     },
     status:{
        type:String,
        require:true,
        default:"pending"
     }
 })

 module.exports = mongoose.model("Transaction_history",TransactionSchema);