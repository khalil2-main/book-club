const jwt= require('jsonwebtoken')
const User= require('../models/userModel')
const Book= require('../models/bookModel')

const requireAuth= (req,res,next)=>{
  const token=req.cookies.acessToken;

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
  
  if(!req.userId){
     res.status(401).send('your token is not valid')
  }
  else{
    console.log(req.userId)
    const user= await User.findById(req.userId)
    if(user.admin){
  
      next();
    }
    else{
      return res.status(401).send("you need admin preveligace admin : ");
    }
  }
}
const adminOrEditorAuth = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).send('Your token is not valid');

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Admin check
    if (user.admin) return next();

    const book = await Book.findById(id);
    if (!book) return res.status(404).send('Book not found');

    // Editor check
    if (book.createdBy.toString() === userId.toString()) return next();

    return res.status(401).send("You need admin or editor privileges");

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports={requireAuth, adminAuth, adminOrEditorAuth}