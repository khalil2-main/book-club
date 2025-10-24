const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
  location: { type: String },
  city: { type: String },
  country: { type: String }
}, { _id: false }); // prevent extra _id field for address

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: [true], 
    
  },
  birthday: { type: Date, required: true },
  address: addressSchema,
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);