const mongoose = require('mongoose');
const { comparePassword } = require('../utils/helpers');



const addressSchema = new mongoose.Schema({
  location: { type: String },
  city: { type: String },
  country: { type: String }
}, { _id: false }); // prevent extra _id field for address

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
  name: { type: String, required: true },
  surname: { type: String, required: true },
=======
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
>>>>>>> frontend
  email: { 
    type: String, 
    required: true, 
    unique: [true], 
    
  },
<<<<<<< HEAD
=======
  admin:{ type: Boolean, default:false},
>>>>>>> frontend
  birthday: { type: Date, required: true },
  address: addressSchema,
  password: { type: String, required: true }
});

userSchema.statics.login= async function(email,password){
  const user= await this.findOne({email});
  if(!user){
    throw  Error('incorrect Email')
  }
  if(!comparePassword(password,user.password)){
    throw Error("incorrect password")
  }
  return user;
}

module.exports = mongoose.model('User', userSchema);