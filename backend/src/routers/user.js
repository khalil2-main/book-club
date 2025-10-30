const { Router } = require('express');
const User= require('./../models/user')
const jwt= require('jsonwebtoken')
const {query, body, matchedData,checkSchema, validationResult}= require('express-validator')
const {createUserValidatorsScheama,updateUserValidatorsScheama,au}= require('./../utils/validationSchema');
const { hashPassword } = require('../utils/helpers');
const passport = require('passport');


const router = Router();
 const errors= {name:'', surname:'', email:'', birthday:'', password:'',address:''}
const erorrHandler= (err)=>{
 
  Object.values(err.errors).forEach((properties)=>{
    
   errors[properties.path]=properties.msg
  })
  const filledErorrs = Object.fromEntries(
  Object.entries(errors).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
);



  
}

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
// insert user
router.post('/api/users',checkSchema(createUserValidatorsScheama), async(req, res)=>{
 const result= validationResult(req);
 
 if(!result.isEmpty()){
    errors=erorrHandler(result)
    res.status(400).send({errors});}

  const data= matchedData(req);

 
  data.password=hashPassword(data.password);
  const newUser= new User(data)
  
  try{
    
    const saveUser= await newUser.save()
    res.status(201).send(saveUser)
  }catch(err){
    //duplicate error code
    if(err.code=== 11000){
      errors.email='Email is already taken'
    }
    return res.status(400).send({errors});

  }  
});
//update user information
router.patch('/api/users/:id',checkSchema(updateUserValidatorsScheama),async (req, res)=>{
    try{
      const {id}= req.params;
      const result= validationResult(req)
      if(!result.isEmpty()){
        errors=erorrHandler(result)
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

  
  //authentication
    router.post('/api/auth', passport.authenticate('local', { session: false }), (req ,res,next)=>{
      passport.authenticate('local',{session:false},(err,user,info)=>{
        if(err || !user){
          return res.status(400).send({error:err?.message|| 'invalid credential'});
        }
        console.log(`inside token creation ${process.env.TOKEN_KEY_SECRET ||`YOURSCREATEKEY`}` )
        const token= jwt.sign({id:user._id, email:user.email}, process.env.TOKEN_KEY_SECRET|| `YOURSCREATEKEY`,{ expiresIn:'1d'});

         res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true if HTTPS
      sameSite: 'strict',
       });

       res.status(200).send({message:'Logged in successfully'})

      })(req, res, next);
      
   
      

  })

module.exports= router;
