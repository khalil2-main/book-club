const { Router}= require('express')
const Book = require('./../models/bookModel')
const {validationResult, matchedData,}=require('express-validator');
const {bookCreationValidator,bookUpdateValidator, isParamValidator} =require ('../validators/books-validator-schema')
const creatUploader= require('../middlewares/upload')
const validate= require('../middlewares/validate')
const router=Router();
const fs = require('fs');
const path = require('path');
const upload=creatUploader('books');

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
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
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


//Create a book

router.post('/',upload.single('image'),bookCreationValidator,validate,async (req, res) => {

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
      console.error(err);
      res.status(500).json({ error: "BAD REQUEST" });
    }
});


router.patch('/:id',isParamValidator, bookUpdateValidator, async (req, res) => {
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



module.exports=router