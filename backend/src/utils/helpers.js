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


// create token
const creatToken=(id,maxAge)=>{
  return jwt.sign({id},process.env.TOKEN_KEY_SECRET ,{
    expiresIn:maxAge
  })
}
module.exports={hashPassword, comparePassword, creatToken}