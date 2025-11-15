const { Router } = require('express');
const User= require('./../models/user')
const jwt= require('jsonwebtoken')
const {query, body, matchedData,checkSchema, validationResult}= require('express-validator')
const {createUserValidatorsScheama,updateUserValidatorsScheama,AuthUserValidatorsScheama}= require('../config/UservalidationSchema');
const { hashPassword } = require('../utils/helpers');

const requireAuth = require('../middlewares/auth');


const router = Router();
 const errors= {}
const erorrHandler= (err)=>{
 
  Object.values(err.errors).forEach((properties)=>{
    
   errors[properties.path]=properties.msg
  })


  
}
const maxAge= 60*60;
// create token
const creatToken=(id)=>{
  return jwt.sign({id},process.env.TOKEN_KEY_SECRET ,{
    expiresIn:maxAge
  })
}
// insert user
router.post('/api/users',checkSchema(createUserValidatorsScheama), async(req, res)=>{
 const result= validationResult(req);
 
 if(!result.isEmpty()){
    erorrHandler(result);
    res.status(400).send({errors});}

  const data= matchedData(req);

 
  data.password=hashPassword(data.password);
  const newUser= new User(data)
  
  try{
    
    const saveUser= await newUser.save()
    const token= creatToken(saveUser._id)
    res.cookie('jwt',token, {httpOnly:true, maxAge:maxAge*1000})
    return res.status(201).send(saveUser)
  }catch(err){
    //duplicate error code
    if(err.code=== 11000){
      errors.email='Email is already taken'
    }
    return res.status(400).send({errors});

  }  
}); 
 //authentication
    router.post('/api/login',checkSchema(AuthUserValidatorsScheama), async (req ,res)=>{
   const result =validationResult(req)
   if(!result.isEmpty()){
      erorrHandler(result);
      res.status(400).send({errors});}

      const {email, password}= matchedData(req);
      try{
        const user= await User.login(email, password)
        const token= creatToken(user._id)
      res.cookie('jwt',token, {httpOnly:true, maxAge:maxAge*1000})
 
          return res.status(200).send({user})
      }catch(err){
        
        if(err.message==='incorrect Email')errors.email='the email is not registered'
        if(err.message==='incorrect password')errors.email='the password is inccorect'
        console.log(err)
        return res.status(400).send({errors});
      }

  })
router.use(requireAuth)

//log out 
  router.get('/api/logout',(req, res)=>{
    res.clearCookie('jwt');
    res.status(200).send('you have been logged out successfully')
  })

router.use(requireAuth)
// get users
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({prenom:1,nom:1}); 
    res.status(200).json(users);
  } catch (err) {
    console.error(' Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// get by ID
router.get('/api/users/:id',async (req, res)=>{
    try{
      const {id }= req.params;
      const user = await User.findById(id)
      
      if(!user) return res.status(400).send({error: 'User not found' });
      return res.status(200).send({user})
    }catch(err){
    console.error(' Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });

  }  
  });

//update user information
router.patch('/api/users/:id',checkSchema(updateUserValidatorsScheama),async (req, res)=>{
    try{
      const {id}= req.params;
      const result= validationResult(req)
      if(!result.isEmpty()){
       erorrHandler(result)
        res.status(400).send({errors});}
      const data= matchedData(req);

      if(data.password)data.password=hashPassword(data.password)

      const user = await User.findByIdAndUpdate(id,data,{
        new: true,
        runValidators:true
      })
      
      if(!user) return res.status(400).send({error: 'document not found' });
      return res.status(200).send({user})
    }catch(err){
     //duplicate error code
      if(err.code=== 11000){
        errors.email='Email is already taken'
      }
      return res.status(400).send({errors});

  }  
  });
// delete user
  router.delete('/api/users/:id',async (req, res,next)=>{
    try{
      const {id }= req.params;
      const deleteUser = await User.findByIdAndDelete(id)
      
      if(!deleteUser) return res.status(400).send({error: 'User not found' });
      return res.status(200).send({message: `User deleted successfully`, user:deleteUser})
    }catch(err){
    console.error(' Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });

  }  
  });

  


module.exports= router;
