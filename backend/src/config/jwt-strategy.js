const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { hashPassword, comparePassword } = require('./helpers');
const User= require('../models/user');


const cookieExtractor= (req)=>{
  let token=null;
  if(req && req.cookies){
    token=req.cookies['JWT'];
  }
  returnToken
};


const opts={
    jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.TOKEN_KEY_SECRET || 'yourSecretKey',
}
passport.use(new JwtStrategy(opts, async(jwt_payload, done)=>{
  try{
    const user= await User.findById(jwt_payload.id);
    if(user) return done(null,user)
  }catch(err){
    done(err,null)
  }
})
);