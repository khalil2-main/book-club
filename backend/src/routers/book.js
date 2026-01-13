const { Router}= require('express')
const Book = require('./../models/bookModel')
const {validationResult, matchedData,}=require('express-validator');
const {bookCreationValidator,bookUpdateValidator, 
  isParamValidator, pageValidator, normalizeGenres, reviewValidator} =require ('../validators/books-validator-schema')
const creatUploader= require('../middlewares/upload')
const validate= require('../middlewares/validate')
const router=Router();
const fs = require('fs');
const path = require('path');
const { requireAuth , adminOrEditorAuth, requireAuthOptional} = require('../middlewares/auth');
const upload=creatUploader('books');
const {recalculateRating}= require('../utils/helpers')

//number of books per page
const limit = 20;

// show the top 15 puppolair book
router.get('/top', async(req, res) => {
  try{
    const books= await Book.find().sort({avrageRating:-1}).limit(15); 
    res.status(200).send({books});
  }
  catch(err){
    console.log(err);
    return res.status(500).send('BAD REQEST')
  }
  
});

// get all book 20 per page
router.get('/',pageValidator, validate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const { title, author, genre, language } = req.query;
    // console.log("Query parameters: " + JSON.stringify(req.query));
    const query={}
    if(title){
      query.title={
        $regex: `^${title}`,
        $options:'i'
      }
    }
    if(author) query.author={
        $regex: `^${author}`,
        $options:'i'
      }
     if(genre){
       const genresArray = genre.split(',').map(g => g.trim());
      query.genres = { $in: genresArray }
    }
    if(language) query.language={
        $regex: `^${language}`,
        $options:'i'
      }

    const skip = (page - 1) * limit;

    const books = await Book.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).send({ page, books });
  } catch (err) {
    console.log(err);
    return res.status(500).send('BAD REQUEST');
  }
});

// Get number of pages
router.get('/npage', async(req, res) => {
  try
{ const { title, author ,genre, language} = req.query;
    const query={}
    if(title){
      query.title={
        $regex: `^${title}`,
        $options:'i'
      }
    }
    if(author) query.author={
        $regex: `^${author}`,
        $options:'i'
      }
    if(genre){
       const genresArray = genre.split(',').map(g => g.trim());
      query.genres = { $in: genresArray }
    }
    if(language) query.language={
        $regex: `^${language}`,
        $options:'i'
      }

    const totalBooks = await Book.find(query).countDocuments()
    
    const totalPages = Math.ceil(totalBooks / limit);
    res.status(200).send({ totalPages });
} catch (err) {
    console.log(err);
    return res.status(500).send({message:'BAD REQUEST' , error: err.message});
}}  );


//Create a book

router.post('/',upload.single('image'),requireAuth,normalizeGenres ,bookCreationValidator,validate,async (req, res) => {

    let data = matchedData(req);
    const id = req.userId
    data.createdBy= id

    try {
      if (req.file) {
        data.coverImageUrl = `/uploads/books/${req.file.filename}`;
      }
      const book = new Book(data);
      const savedBook = await book.save();

      res.status(201).json({
        message: "Book created",
        book: savedBook
      });

    } catch (err) {
  if (err.code === 11000) {
    // Duplicate key for author + title
    if (err.keyPattern && err.keyPattern.author && err.keyPattern.title) {
      return res.status(409).json({
        message: "Validation failed",
        errors: "This book is already regestered by another user."
      });
    } 
    // Duplicate key for ISBN
    else if (err.keyPattern && err.keyPattern.isbn) {
      return res.status(409).json({
        message: "Validation failed",
        errors: "A book with this ISBN already exists."
      });
    }
  }

  console.error(err);
  res.status(500).json({ error: "Server error", details: err.message });
}
});
//get book by id
router.get('/:id',isParamValidator,requireAuthOptional,validate ,async (req, res) => {
   try{ const {id}= req.params;
   const userId= req.userId;


  const book= await Book.findById(id)
  .populate('reviews.userId','firstname lastname profileImage');
  if(!book) return res.status(404).send({messge: 'book is not found'})
  
  if(!userId) return res.status(200).send({book,myReview:null})
  // check if there an existing review
 const myReview= book.reviews.find( r => r.userId._id.toString() === userId.toString())||null;
 const otherReviews = book.reviews.filter( r => !userId || r.userId._id.toString() !== userId.toString());
   res.status(200).send({book:{ ...book.toObject(), reviews: otherReviews },myReview})
  
  }catch(err){
    console.log(err)
   res.status(500).json({ error: "Server error"});
  }
});
//edit a book
router.patch('/:id',isParamValidator,upload.single('image'),requireAuth,
adminOrEditorAuth,normalizeGenres,bookUpdateValidator,validate,async (req, res) => {
    

    try {
      const { id } = req.params;


    const data = matchedData(req);
 

      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      // Handle cover image update
      if (req.file) {
        // Delete old image if it exists
        if (book.coverImageUrl) {
          const oldImagePath = path.join(__dirname, '../..', book.coverImageUrl);
          fs.access(oldImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(oldImagePath, (err) => {
                if (err) console.error('Failed to delete old image:', err);
              });
            }
          });
        }
        data.coverImageUrl = `/uploads/books/${req.file.filename}`;
      }

      const updatedBook = await Book.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
      });
      
      res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (err) {
  if (err.code === 11000) {
    // Duplicate key for author + title
    if (err.keyPattern && err.keyPattern.author && err.keyPattern.title) {
      return res.status(409).json({
        message: "Validation failed",
        errors: "This book is already regestered by another user."
      });
    } 
    // Duplicate key for ISBN
    else if (err.keyPattern && err.keyPattern.isbn) {
      return res.status(409).json({
        message: "Validation failed",
        errors: "A book with this ISBN already exists."
      });
    }
  }
  }}
);

// add or edit a review
router.put('/review/:id',isParamValidator, reviewValidator,requireAuth, validate, async(req,res)=>{
  try{ const {id}= req.params;
   const userId= req.userId;
   const {Comment,rating}= req.query

  const book= await Book.findById(id);
  if(!book) return res.status(404).send({messge: 'book is not found'})
  
  // check if there an existing review
 const bookReview= book.reviews.find(r=> r.userId.toString() ===userId.toString());

 if(bookReview){
  if(rating!==undefined)bookReview.rating=rating
  if(Comment!==undefined)bookReview.Comment=Comment
 }
  
 else{
  const commentedAt= Date.now()
  book.reviews.push({
    userId,
    rating,
    Comment,
    commentedAt
  })
  }
  recalculateRating(book)
  await book.save();
  return res.status(200).send({reviews:book.reviews})

  }catch(err){
    console.log(err)
   res.status(500).json({ error: "Server error"});
  }
})



//delete a book
router.delete('/:id',isParamValidator,requireAuth , adminOrEditorAuth , async (req, res) => {
  const {id}= req.params
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    // delete cover image file if exists
    if (book.coverImageUrl) {
      const imagePath = path.join(__dirname, '../..', book.coverImageUrl);
     fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Failed to delete image:', err);
        });
      }
  });

    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});




module.exports=router