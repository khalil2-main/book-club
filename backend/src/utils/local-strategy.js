const passport = require('passport');
const {Strategy} = require('passport-local');
const { hashPassword } = require('./helpers');

passport.use(
  new Strategy({usernameField:'email'},(username, password, done)=>{
    try{
      const findUser=mockUser.find((user)=>user.username===username);
      if (!findUser)throw new Error('Eser not found');
      if(hashPassword(findUser.password)!==password) throw new Error('Password does\'t match');
      done(null,findUser);
    }catch(err){
      done(err,null);
    }
  })
)