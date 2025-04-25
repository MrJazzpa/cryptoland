const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

 const AdminSchema = new Schema({
    username:{
        type:String,
         require:true,
         default:"Admin"

    },
    password:{
        type:String,
        require:true,
        default:"Admin@1"
    }
})

module.exports = mongoose.model("admin",AdminSchema)

