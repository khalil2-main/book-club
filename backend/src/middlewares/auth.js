const jwt= require('jsonwebtoken')
const User= require('./../models/user')

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
       
        req.userId=decodedToken.id
        next();
      }
    })
  }
  //if cookie is expired
  else{
     res.status(401).send('your token is exprired')
  }
}

// admin authentication
const adminAuth= async(req,res, next)=>{
  
  if(!req.decodedToken){
     res.status(401).send('your token is not valid')
  }
  else{
    console.log(req.decodedToken)
    const user= await User.findById(req.userId)
    if(user.admin){
  
      next();
    }
    else{
      return res.status(401).send("you need admin preveligace admin : ");
    }
  }
}

module.exports={requireAuth, adminAuth}