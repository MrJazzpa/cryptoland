const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  
    name :{
         type: String,
         required:true
    },
    email :{
        type: String,
        required:true
   },

   password :{
    type: String,
    required:true
},
createAt :{ 
    type: Date,
    default: Date.now()
   
},

updateAt :{
    type: Date,
    default: Date.now()
    
},
verification_status:{
     type: String,
     default:"not Verified"
}
});

module.exports = mongoose.model("Users",UsersSchema);