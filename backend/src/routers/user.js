const { Router } = require('express');
const User= require('./../models/user')
const {query, body, matchedData,checkSchema, validationResult}= require('express-validator')
const {createUserValidatorsScheama,updateUserValidatorsScheama}= require('./../utils/validationSchema');
const { hashPassword } = require('../utils/helpers');

const router = Router();

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
 console.log(result);
 if(!result.isEmpty()) return res.status(400).send({errors: result.array()})

  const data= matchedData(req)


  data.password=hashPassword(data.password);
  const newUser= new User(data)
  try{
    const saveUser= await newUser.save()
    res.status(201).send(saveUser)
  }catch(err){
    console.error(err);
    return res.status(400).send('bad request')

  }  
});
//update user information
router.patch('/api/users/:id',checkSchema(updateUserValidatorsScheama),async (req, res)=>{
    try{
      const {id}= req.params;
      const data= matchedData(req)
      if(data.password)data.password=hashPassword(data.password)

      const user = await User.findByIdAndUpdate(id,data,{
        new: true,
        runValidators:true
      })
      
      if(!user) return res.status(400).send({error: 'document not found' });
      return res.status(200).send({user})
    }catch(err){
    console.error(' Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });

  }  
  });
// delete user
  router.delete('/api/users/:id',async (req, res)=>{
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
