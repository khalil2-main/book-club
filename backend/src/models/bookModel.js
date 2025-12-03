const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"], 
    minlength: [3, "Title must be at least 3 characters long"]
  },

  author: { 
    type: String, 
    required: [true, "Author name is required"],
    minlength: [3, "Author name must be at least 3 characters long"]
  },

  language: { 
    type: String, 
    minlength: [3, "Language must be at least 3 characters long"]
  },

  pageNumbers: { 
    type: Number, 
    min: [1, "Page number must be at least 1"],
    max: [3000, "Page number cannot exceed 3,000"]
  },

  genres: {
    type: [String],
    validate: {
      validator: arr => Array.isArray(arr) && arr.length > 0,
      message: "At least one genre is required"
    }
  },

  summary: { 
    type: String, 
    maxlength: [2000, "Summary cannot exceed 2000 characters"]
  },

  isbn: { 
    type: String,
    validate: {
      validator: v => {
        if (!v) return true; // allow empty ISBN
        return /^\d{10}(\d{3})?$/.test(v);
      },
      message: "ISBN must be 10 or 13 digits"
    }
  },

  publishedYear: { 
    type: Number,
    min: [0, "Published year cannot be negative"],
    max: [new Date().getFullYear(), "Published year cannot be in the future"]
  },

  coverImage: {
    data: Buffer,
    contentType: {
      type: String,
      validate: {
        validator: v => {
          if (!v) return true; 
          return /^image\/(jpeg|jpg|png|gif|webp)$/i.test(v);
        },
        message: "Cover image must be a valid image type (jpeg, jpg, png, gif, webp)"
      }
    }
  },

  rating: { 
    type: Number, 
    min: [0, "Rating cannot be lower than 0"],
    max: [5, "Rating cannot be higher than 5"]
  },

  status: {
    type: String,
    enum: {
      values: ['reading', 'completed', 'want-to-read'],
       },
  
  },

  dateAdded: { type: Date, default: Date.now }

}, { _id: false });

module.exports = bookSchema;
