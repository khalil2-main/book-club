const { Router } = require('express');
const User= require('./../models/userModel')

const { matchedData, validationResult}= require('express-validator')
const {updateUserValidator}= require('../validators/UservalidationSchema');
const { hashPassword } = require('../utils/helpers');
const { adminAuth}= require('../middlewares/auth');
const upload= require('../middlewares/upload')


const router = Router();
 const errors= {}


//--Authonticated user mangemnt api--//

router.get('/me', async(req, res)=>{
  try{
    const userId= req.userId;
    const user= await User.findById(userId);
    if(!user) return res.status(400).send({error: 'User not found' });
    return res.status(200).send({user})
  }catch(err){
    console.error(' Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --User update api --//
router.patch('/me',upload.single('image'),updateUserValidator,async (req, res)=>{
    try{
      const userId= req.userId;
      const result= validationResult(req)
      if(!result.isEmpty()){
       erorrHandler(result)
        res.status(400).send({errors});}
      const data= matchedData(req);
      
      if (req.file) {
      data.profileImage = `/uploads/users/${req.file.filename}`;
    }
      
      const user = await User.findByIdAndUpdate(userId,data,{
        new: true,
        runValidators:true
      });
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


//-- Admin user mangemnt api --//
 // get all users
router.get('',adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({prenom:1,nom:1}); 
    res.status(200).json(users);
  } catch (err) {
    console.error(' Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//filtering users
router.get("/search",adminAuth , async (req, res) => {
  try {
    const { firstname, lastname, email, role } = req.query;

    const filter = {};

    if (firstname) {
      filter.firstname = { $regex: '^' + firstname, $options: 'i' };
    }

    if (lastname) {
      filter.lastname = { $regex: '^' + lastname, $options: 'i' };
    }

    if (email) {
      filter.email = { $regex: '^' + email, $options: 'i' };
    }

    if (role) {
      filter.admin = role === "admin";
    }

    const users = await User.find(filter).sort({ firstname: 1, lastname: 1 });

    res.status(200).json(users);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// get by ID
router.get('/:id',async (req, res)=>{
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
router.patch('/:id',updateUserValidator,async (req, res)=>{
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
  router.delete('/:id',async (req, res,next)=>{
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
