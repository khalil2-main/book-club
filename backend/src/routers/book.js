const { Router}= require('express')
const Book = require('../models/book');
const { requireAuth } = require('../middlewares/auth');

const router=Router();

// GET /api/book - list books from DB, fallback to empty array
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/book - create a new book (authenticated)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, author, cover } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newBook = new Book({
      title,
      description,
      author: author || undefined,
      cover: cover || undefined,
      createdBy: req.userId,
    });

    const saved = await newBook.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating book:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports=router