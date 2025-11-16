const jwt= require('jsonwebtoken')
<<<<<<< HEAD

=======
const User= require('./../models/user')
>>>>>>> frontend

const requireAuth= (req,res,next)=>{
  const token=req.cookies.jwt;

  if(token){
    jwt.verify(token,process.env.TOKEN_KEY_SECRET,(err, decodedToken)=>{
      //if token isn't valid
      if(err){
        console.log('consol error\n'+ err);
        res.status(401).send('your token is not valid')
      }
      else{
        console.log(decodedToken);
        next();
      }
    })
  }
  //if cookie is expired
  else{
     res.status(401).send('your token is exprired')
  }
}
<<<<<<< HEAD
=======
const adminAuth= (req,res, next)=>{
  if(!decodedToken){
     res.status(401).send('your token is not valid')
  }
  else{
    const user= User.findById(decodedToken);
    if(user.admin){
      console.log('admin isconnected')
      next();
    }
    else{
      console.log("you need admin preveligace")
    }
  }
}
>>>>>>> frontend

module.exports=requireAuth