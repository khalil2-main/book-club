const { Router } = require('express');
const User= require('./../models/userModel')

const fs = require('fs');
const path = require('path');
const validate = require('../middlewares/validate');

const { matchedData, validationResult}= require('express-validator')
const {updateUserValidator, isParamValidator}= require('../validators/UservalidationSchema');

const { adminAuth}= require('../middlewares/auth');
const creatUploader= require('../middlewares/upload')


const router = Router();
const upload=creatUploader('users');



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
router.patch('/me',upload.single('image'),updateUserValidator, validate,async (req, res)=>{
    try{
      const userId= req.userId;
     
      
      const data= matchedData(req);
      const user = await User.findById(userId);
        // Handle address JSON string
      if (req.body.address) {
        data.address = JSON.parse(req.body.address);
      }
  
      if (req.file) {

      //delete the old picture if it exist
   if (req.file && user.profileImage) {
  const oldImagePath = path.join(__dirname, '../..', user.profileImage);

    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }
  });
}

      data.profileImage = `/uploads/users/${req.file.filename}`;
    }
      
      const updateUser = await User.findByIdAndUpdate(userId,data,{
        new: true,
        runValidators:true
      });
      
      return res.status(200).send({updateUser})

      
    }catch(err){
     //duplicate error code
      if(err.code=== 11000){
         return res.status(400).send({
          errors: [{ field: "email", message: "Email is already taken" }],});
      }
      return res.status(500).send({ error: "Server error" });
  }  
  });


//-- Admin user mangemnt api --//


//filtering users
router.get("/", adminAuth, async (req, res) => {
  try {
    const { firstname, lastname, email, role } = req.query;
    const filter = {};

    if (firstname) {
      filter.firstname = { $regex: "^" + firstname, $options: "i" };
    }

    if (lastname) {
      filter.lastname = { $regex: "^" + lastname, $options: "i" };
    }

    if (email) {
      filter.email = { $regex: "^" + email, $options: "i" };
    }

    if (role) {
      filter.admin = role === "admin";
    }

    const users = await User.find(filter).sort({
      firstname: 1,
      lastname: 1,
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});




// get by ID
router.get('/:id',isParamValidator,async (req, res)=>{
    try{
      const {id }= req.params;
      const user = await User.findByIdAndUpdate(id,
        {$inc:{visitCount:1}},
        {new:true}
      )
      
      if(!user) return res.status(400).send({error: 'User not found' });
      return res.status(200).send({user})
    }catch(err){
    console.error(' Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });

  }  
  });


///update user information

router.patch(
  "/:id",upload.single("image"),isParamValidator,updateUserValidator,
  validate,async (req, res) => {
    try {
      const { id } = req.params;

  

      let data = matchedData(req, { locations: ["body"] });

      // Handle address JSON string
      if (req.body.address) {
        data.address = JSON.parse(req.body.address);
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Handle image update
      if (req.file) {
        if (user.profileImage) {
          const oldImagePath = path.join(
            __dirname,
            "../..",
            user.profileImage
          );

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        data.profileImage = `/uploads/users/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({ user: updatedUser });
    } catch (err) {
      console.error(err);

      if (err.code === 11000) {
        return res.status(400).json({
          errors: [{ field: "email", message: "Email is already taken" }],
        });
      }

      return res.status(500).json({ error: "Server error" });
    }
  }
);


// delete user
  router.delete('/:id',isParamValidator,async (req, res,next)=>{
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
