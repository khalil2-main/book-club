const { Router } = require('express');
const Book = require('../models/bookModel');
const { validationResult, matchedData } = require('express-validator');
const {
  bookCreationValidator,
  bookUpdateValidator,
  isParamValidator,
  pageValidator,
  normalizeGenres,
} = require('../validators/books-validator-schema');
const createUploader = require('../middlewares/upload');
const validate = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');

const router = Router();
const upload = createUploader('books');

// number of books per page
const limit = 20;

/**
 * GET /api/book/top
 * Top 15 popular books
 */
router.get('/top', async (req, res) => {
  try {
    const books = await Book.find().sort({ rating: -1 }).limit(15);
    res.status(200).json({ books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'BAD REQUEST' });
  }
});

/**
 * GET /api/book?page=1
 * Paginated books
 */
router.get('/', pageValidator, validate, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ page, books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'BAD REQUEST' });
  }
});

/**
 * GET /api/book/npage
 * Total pages
 */
router.get('/npage', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);
    res.status(200).json({ totalPages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'BAD REQUEST', error: err.message });
  }
});

/**
 * POST /api/book
 * Create a book
 */
router.post(
  '/',
  upload.single('image'),
  requireAuth,
  normalizeGenres,
  bookCreationValidator,
  validate,
  async (req, res) => {
    try {
      const data = matchedData(req);

      if (req.file) {
        data.coverImageUrl = `/uploads/books/${req.file.filename}`;
      }

      const book = new Book(data);
      const savedBook = await book.save();

      res.status(201).json({
        message: 'Book created',
        book: savedBook,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({
          message: 'Validation failed',
          errors: 'A book with this ISBN already exists.',
        });
      }
      console.error(err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
);

/**
 * GET /api/book/:id
 * Get book by ID
 */
router.get('/:id', isParamValidator, validate, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * PATCH /api/book/:id
 * Update book
 */
router.patch(
  '/:id',
  isParamValidator,
  requireAuth,
  bookUpdateValidator,
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const data = matchedData(req);

      const book = await Book.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      res.status(200).json(book);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'BAD REQUEST' });
    }
  }
);

module.exports = router;
