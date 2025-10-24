const bcrypt = require('bcrypt');

const saltRound=10;

const hashPassword= (password)=>{
  const salt=  bcrypt.genSaltSync(saltRound);
  return bcrypt.hashSync(password,salt)
}

const comparePassword= (password, hashed)=>{
  return bcrypt.compareSync(password,hashed)
}

module.exports={hashPassword, comparePassword}