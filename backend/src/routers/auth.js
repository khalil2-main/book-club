const { Router } = require('express');
const User = require('../models/userModel');
const {matchedData, validationResult}= require('express-validator')
const {createUserValidator,authUserValidator} = require('../validators/UservalidationSchema');
const { hashPassword, creatToken,} = require('../utils/helpers');
const validate =require('../middlewares/validate')
const jwt= require('jsonwebtoken');
const { requireAuth } = require('../middlewares/auth');
const router = Router();
const aceesTokenAge = 10*60; //10minuts
const refreshTokenTokenAge = 7 * 24 * 60 * 60; // a week

//   REGISTER USER
-
router.post('/register', createUserValidator, validate, async (req, res) => {
  

  const data = matchedData(req);
  data.password = hashPassword(data.password);

  try {
    const newUser = new User(data);
    const savedUser = await newUser.save();

    const accessToken = creatToken(savedUser._id,aceesTokenAge);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: aceesTokenAge * 1000,
      sameSite: 'lax',
      secure: false 
    });
    const refreshToken = jwt.sign({id:savedUser._id},process.env.REFRESH_TOKEN_KEY_SECRET,{
      expiresIn: refreshTokenTokenAge
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenTokenAge * 1000,
      sameSite: 'lax',
      secure: false 
    });
    return res.status(201).send(savedUser);
  } catch (err) {
    if(err.code === 11000) return  res.status(400).send({error:{email:'this Email is already taken'}})
    console.log(err)
    
    return res.status(400).send('serever error');
  }
});


//      LOGIN

router.post('/login', authUserValidator, validate, async (req, res) => {
  

  const { email, password } = matchedData(req);

  try {
    const user = await User.login(email, password);

    const accessToken = creatToken(user._id,aceesTokenAge);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: aceesTokenAge * 1000,
      sameSite: 'lax'
    });
    const refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN_KEY_SECRET,{
      expiresIn: refreshTokenTokenAge
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenTokenAge * 1000,
      sameSite: 'lax'
    });

    return res.status(200).send({ user });
  } catch (err) {

    if (err.message === 'incorrect Email')
      errors.email = 'The email is not registered';

    if (err.message === 'incorrect password')
      errors.password = 'The password is incorrect';
    console.log(err)
    return res.status(400).send({messge: 'server error' });
  }
});


// Refresh Token
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).send('No refresh token');

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY_SECRET
    );

    const user = await User.findById(decoded.id);
    if (!user) return res.status(403).send('Invalid refresh token');

    const newAccessToken = creatToken(user._id, aceesTokenAge);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: aceesTokenAge * 1000,
      sameSite: 'lax'
    });

    res.status(200).send({ message: 'Token refreshed' });
  } catch {
    res.status(403).send('Refresh token expired or invalid');
  }
});


// Check token
router.get('/check',(req,res)=>{
  const token=req.cookies.accessToken;

  if (!token) return res.status(401).send({ auth: false });


  jwt.verify(token, process.env.TOKEN_KEY_SECRET, (err,decodedToken)=>{
    if(err)return res.status(200).send({auth:false})
    
    return res.status(200).send({
      auth:true,
   
    })
  })
})

router.get('/isAdmin',requireAuth,async(req,res)=>{
  try{const userId =req.userId
  const user= await User.findById(userId);
  if(!user) return res.status(400).send({err: "User not found"})
  return res.status(200).send({admin:user.admin})}
  catch(err){
    console.log(err);
    return res.status(500).send({message:'server error'})
  }
})
router.get('/isEditor/:id',requireAuth,async(req,res)=>{
   try{
    const userId=req.userId;
    const {id} = req.params
    if(id === userId) return res.status(200).send({editor: true })
    return res.status(200).send({editor: false })
    
   }
   catch(err) {
    
    console.log(err);
     return res.status(500).send({message: "server error"})
   }
})

//     LOGOUT

router.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.status(200).send('You have been logged out successfully');
});

module.exports = router;
