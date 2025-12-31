const mongoose = require('mongoose');
const { comparePassword } = require('../utils/helpers');

// ---------- Address Schema ----------
const addressSchema = new mongoose.Schema({
  location: { type: String },
  city: { type: String },
  country: { type: String }
}, { _id: false });

// ---------- Book Schema ----------
const bookSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book',       
    required: true 
  },
  currentlyReading: { 
    type: Boolean, 
    default: false 
  },
  favorite: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

// ---------- User Schema ----------
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true
  },

  admin:{ type: Boolean, default:false },
  birthday: { type: Date, required: true },
  address: addressSchema,

  //  list books
  books: [bookSchema],

  // profile image 
  profileImage: {
    type: String,
    required: false
  },

  password: { type: String, required: true },
  visitCount:{
    type: Number,
    default: 0
  }

});

// Static Login Method
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) throw Error('incorrect Email');

  if (!comparePassword(password, user.password)) {
    throw Error("incorrect password");
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
