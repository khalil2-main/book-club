const passport = require('passport');
const {Strategy} = require('passport-local');
const { comparePassword } = require('./helpers');
const User= require('./../models/user')

// passport.serializeUser((user,done)=>{
//   console.log('inside deserialize')
//   console.log(`user /n ${user}`)
//   done(null,user);
// })

// passport.deserializeUser(async(id,done)=>{
//   console.log('inside deserialize')
//   console.log(`user ID: ${id}`)
//   try{
//     const findUser= User.findById(id);
//     if(!findUser)throw new Error('Eser not found');
//     done(null,user)
//   }catch(err){
//     done(err,null)
//   }
// })
passport.use(
  new Strategy({usernameField:'email'},async(username, password, done)=>{
    console.log({username})
    console.log({password})
    try{
      const findUser=await User.findOne({email:username});
      if (!findUser)throw new Error('Eser not found');
      if(!comparePassword(password,findUser.password)) throw new Error('Password does\'t match'+password+'\n'+findUser.password);
      done(null,findUser);
    }catch(err){
      done(err,null);
    }
  })
)

module.exports=passport
