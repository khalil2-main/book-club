const mongoose = require('mongoose');


const userSchema= mongoose.Schema({
  prenom: {
    type: String, required: true},
  nom:{
    type: String,  required: true},
  email:{
    type: String,
     required: true, unique:true, match: [/^\S+@\S+\.\S+$/, 'Invalid email format']},
  birthday:{
    type: Date,
     required: true},
  password:{
    type: String, required: true}

})

module.exports=mongoose.model('User', userSchema)