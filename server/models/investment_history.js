const mongoose= require('mongoose');
const Schema = mongoose.Schema;

InvestHistorySchema = new Schema({
    
        userid:{
             type:String,
             require:true
        },
        plan:{
            type:String,
            require:true
        },
       investmentAmount:{
            type:String,
            require:true
       },
       number_times:{
        type:String,
        require:true
       },
       Percentage_return:{
        type:String,
        require:true
       },
     
    date:{
        type: String, // Store as a formatted string
        default: function () {
            let today = new Date();
            let day = String(today.getDate()).padStart(2, "0");
            let month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            let year = today.getFullYear();
            return `${day}-${month}-${year}`;
        }

    }
})
module.exports = mongoose.model('InvestmentHistory',InvestHistorySchema);