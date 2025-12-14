const { Router}= require('express')
const Book = require('./../models/bookModel')
const {validationResult, matchedData,}=require('express-validator');
const {bookCreationValidator,bookUpdateValidator, isParamValidator, pageValidator, normalizeGenres} =require ('../validators/books-validator-schema')
const creatUploader= require('../middlewares/upload')
const validate= require('../middlewares/validate')
const router=Router();
const fs = require('fs');
const path = require('path');
const { requireAuth, adminAuth } = require('../middlewares/auth');
const upload=creatUploader('books');

//number of books per page
const limit = 20;

// show the top 15 puppolair book
router.get('/top', async(req, res) => {
  try{
    const books= await Book.find().sort({rating:1}).limit(15); 
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

    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ rating: 1 })
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
{
    const totalBooks = await Book.countDocuments();
    
    const totalPages = Math.ceil(totalBooks / limit);
    res.status(200).send({ totalPages });
} catch (err) {
    console.log(err);
    return res.status(500).send({message:'BAD REQUEST' , error: err.message});
}}  );


//Create a book

router.post('/',upload.single('image'),requireAuth,normalizeGenres ,bookCreationValidator,validate,async (req, res) => {

    let data = matchedData(req);

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
        return res.status(409).json({
          message: "Validation failed",
          errors: "A book with this ISBN already exists."
        });
      }
      console.error(err);
      res.status(500).json({ error: "Server error", details: err.message});
    }
});

router.get('/:id',isParamValidator,validate ,async (req, res) => {
  const {id}= req.params    
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(200).json({ book });
  }
    catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.patch('/:id',isParamValidator,requireAuth, bookUpdateValidator, async (req, res) => {
  const {id}= req.params
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed",details: errors.array()
    });
  }
  const data = matchedData(req);
  try {
    
    const book = await findByIdAndUpdate(id,data,{
      new:true,
      runValidators:true
    })
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "BAD REQEST" });
  }
});

router.delete('/:id',isParamValidator,requireAuth , adminAuth , async (req, res) => {
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