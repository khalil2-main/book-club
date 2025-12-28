const mongoose = require('mongoose');

//review schema
const reviewScheam= new mongoose.Schema({
  userId:{
    type: mongoose.Types.ObjectId,
    ref:'users',
    required:true
  },
  rating: { 
    type: Number, 
    min: [0, "Rating cannot be lower than 0"],
    max: [5, "Rating cannot be higher than 5"],
    default:0
  },
  Comment:{
    type:String,
    maxlength:500,

  }

},{_id: false});

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
    min: [5, "Page number must be at least 5"],
    max: [3000, "Page number cannot exceed 3,000"]
  },

  genres: {
    type: [String],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: "At least one genre is required"
    }
  },

  summary: { 
    type: String, 
    maxlength: [2000, "Summary cannot exceed 2000 characters"]
  },

  isbn: { 
    type: String,
    unique: true,
    sparse: true, // prevents index error when ISBN is optional
    validate: {
      validator: function (value) {
        if (!value) return true; // optional field
        return /^\d{10}(\d{3})?$/.test(value);
      },
      message: "ISBN must be 10 or 13 digits"
    }
  },

  publishedYear: { 
    type: Number,
    min: [1500, "Published year cannot be negative"],
    max: [new Date().getFullYear(), "Published year cannot be in the future"]
  },

  coverImageUrl: { type: String},
  


  rating: { 
    type: Number, 
    min: [0, "Rating cannot be lower than 0"],
    max: [5, "Rating cannot be higher than 5"],
    default:0
  },
  reviews:{
    type: [reviewScheam]
  },

  status: {
    type: String,
    enum: {
      values: ['reading', 'completed', 'want-to-read'],
      message: "Status must be 'reading', 'completed', or 'want-to-read'"
    }
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    require:true
  },


  dateAdded: { 
    type: Date, 
    default: Date.now 
  }

});

module.exports = mongoose.model('Book', bookSchema);
