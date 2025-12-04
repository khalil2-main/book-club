const { Router}= require('express')
const Book = require('../models/bookModel')
const {validationResult, matchedData}=require('express-validator')

const router=Router();




// show the top 15 puppolair book
router.get('/', async(req, res) => {
  try{
    const books= await Book.find().sort({rating:1}).limit(15); 
    res.status(200).send({books})
  }
  catch(err){
    console.log(err);
    return res.status(500).send('BAD REQEST')
  }
  
});

// 
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

router.post('/', bookValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Validation failed",details: errors.array()
    });
  }
  const data = matchedData(req);
  try {
    const book = new Book(data);
    const savedBook = await book.save();
    res.status(201).json({ message: "Book created", book: savedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "BAD REQEST" });
  }
});




module.exports=router