const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const investmentSchema = new Schema({
    plan:{
          type:String,
          require:true
    },

    percentage:{
        type:String,
        require:true
    },
    times:{
        type:String,
        require:true
    },
    min_amount:{
        type:String,
        require:true
    },
    max_amount:{
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
        },
       }
   

})

module.exports = mongoose.model('investmentPlan',investmentSchema)