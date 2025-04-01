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
     deposit_type:{
       type:String,
       require:false,
       default:"Deposit"
     },
      crypto_coin:{
           type:String,
           require:false,
           default:"No Crypto"
      },
      crypto_amount:{
         type:String,
         require:false,
         default:"No Coin"
      },
     status:{
        type:String,
        require:true,
        default:"pending"
     },
     date:{
      type: String, // Store as a formatted string
      default: function () {
          let today = new Date();
          let day = String(today.getDate()).padStart(2, "0");
          let month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
          let year = today.getFullYear();
          return `${day}-${month}-${year}`;
      },
     }
 })

 module.exports = mongoose.model("Transaction_history",TransactionSchema);