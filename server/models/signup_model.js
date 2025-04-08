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
   phone_number :{
    type: String,
    required:true,
    default:"null"
},
   country :{
    type: String,
    required:true,
    default:"null"
},
state:{
    type: String,
    required:true,
    default:"null"
},

dob :{
    type: String,
    required:true,
    default:"null"
},
address :{
    type: String,
    required:true,
    default:"null"
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