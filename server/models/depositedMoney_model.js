 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 const DepositeSchema = new Schema({
     userid:{
        type:String,
        require:true
     },
     amount:{
        type: String,
        require:true
     },
     transactionId:{
        type:String,
        require:true
     }
 })

 module.exports = mongoose.model("deposite",DepositeSchema);