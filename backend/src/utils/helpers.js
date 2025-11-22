const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken')
const saltRound=10;

const hashPassword= (password)=>{
  const salt=  bcrypt.genSaltSync(saltRound);
  return bcrypt.hashSync(password,salt)
}

const comparePassword= (password, hashed)=>{
  return bcrypt.compareSync(password,hashed)
}
// handele error
const erorrHandler = (err) => {
  const errors = {};

  // Duplicate key error (e.g., email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken`;
  } else if (err.errors) {
    // Validation errors
    Object.values(err.errors).forEach((property) => {
      errors[property.path] = property.message;
    });
  }

  return errors;
};
// create token
const creatToken=(id,maxAge)=>{
  return jwt.sign({id},process.env.TOKEN_KEY_SECRET ,{
    expiresIn:maxAge
  })
}
module.exports={hashPassword, comparePassword,erorrHandler, creatToken}