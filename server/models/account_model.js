const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountSchema = new Schema({
    userid:{
        type:String,
        require:true
    },
    Btc_Amount:{
        type:String,
        require:false,
        default:"0"

    },
    Ethereum_Amount:{
        type:String,
        require:false,
        default:"0"
    },
    Doge_Amount:{
        type:String,
        require:false,
        default:"0"
    },
    Usdt_Amount:{
        type:String,
        require:false,
        default:"0"
    },
    Total_Balance:{
        type:String,
        require:false,
        default:"0"
    },
    Deposit_Balance:{
        type:String,
        require:false,
        default:"0"
    }



    
})
module.exports = mongoose.model("Account",accountSchema);