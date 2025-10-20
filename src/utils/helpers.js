const bcrypt = require('bcrypt');

const saltRound=10;

const hashPassword= (password)=>{
  const salt=  bcrypt.genSaltSync(saltRound);
  return bcrypt.hashSync(password,salt)
}

module.exports={hashPassword}