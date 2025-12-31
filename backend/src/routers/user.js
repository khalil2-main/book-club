const { Router } = require('express');
const User= require('./../models/userModel')
const Book = require('./../models/bookModel')
const fs = require('fs');
const path = require('path');
const validate = require('../middlewares/validate');

const { matchedData, validationResult}= require('express-validator')
const {updateUserValidator, isParamValidator}= require('../validators/UservalidationSchema');
const { hashPassword } = require('../utils/helpers');
const { adminAuth}= require('../middlewares/auth');
const creatUploader= require('../middlewares/upload')


const router = Router();
const upload=creatUploader('users');
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


//update user information

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


//--books related routes--//

// add a book to favorite book list
router.patch('/addFav/:id',isParamValidator, async(req,res)=>{
  try{const userId= req.userId;
  const bookId= req.params.id;
  const user= await  User.findById(userId)
  if(!user) return res.status(404).send({message : 'user not found'})
  
  bookIndex= user.books.findIndex(
    (book=>book.bookId.toString()===bookId)
  );
  if(bookIndex!= -1){
    user.books[bookIndex].favorite= !user.books[bookIndex].favorite;
  }
  else{
    user.books.push({
        bookId,
      favorite: true,
      currentlyReading: false
    })
  }
  await user.save()
   res.status(200).json({
      message: 'Favorite status updated',
      books: user.books
    });
  
    res.status(200).send({user})
  }catch(err){
    console.log(err);
    return res.status(500).send('server error')
  }
})

//add to curently reading

router.patch('/addtoreading/:id',isParamValidator, async(req,res)=>{
  try{const userId= req.userId;
  const bookId= req.params.id;
  const user= await  User.findById(userId)
  if(!user) return res.status(404).send({message : 'user not found'})
  
  bookIndex= user.books.findIndex(
    (book=>book.bookId.toString()===bookId)
  );
  if(bookIndex!= -1){
    user.books[bookIndex].currentlyReading= !user.books[bookIndex].currentlyReading;
  }
  else{
    user.books.push({
        bookId,
      favorite: false,
      currentlyReading: true
    })
  }
  await user.save()
   res.status(200).json({
      message: 'Favorite status updated',
      books: user.books
    });
  
    res.status(200).send({user})
  }catch(err){
    console.log(err);
    return res.status(500).send('server error')
  }
})

// get book stauts 
router.get('/book-status/:id',async(req,res)=>{
  try{
    const userId= req.userId;
  const bookId= req.params.id;
   const user=await User.findById(userId);
   if(!user)return res.status(404).send({message: 'User not found'})
    const bookIndex= user.books.findIndex(
      (book=>book.bookId.toString()===bookId)
    )
    if(bookIndex===-1) return res.status(404).send({messgae:'no staus related to this book'})
      res.status(200).send({currentlyReading:user.books[bookIndex].currentlyReading, 
    favorite:user.books[bookIndex].favorite})

  }
  catch(err){
     console.log(err);
    return res.status(500).send('server error')
  }
})

router.get('/books/favorites/:id', isParamValidator, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('books.bookId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteBooks = user.books
      .filter(book => book.favorite)
      .map(book => book.bookId);

    if (favoriteBooks.length === 0) {
      return res.status(404).json({ message: 'No favorite books found' });
    }

    res.status(200).json({ favoriteBooks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/books/currentlyReading/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate('books.bookId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const readingBooks = user.books
      .filter(book => book.currentlyReading)
      .map(book => book.bookId);

    if (readingBooks.length === 0) {
      return res.status(404).json({ message: "Haven't started reading yet" });
    }

    res.status(200).json({ readingBooks });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/CreatedBooks/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const books = await Book.find({ createdBy: userId });

    if (books.length === 0) {
      return res.status(404).json({
        message: 'You have not added any books'
      });
    }

    res.status(200).json({ books });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
 


module.exports= router;
