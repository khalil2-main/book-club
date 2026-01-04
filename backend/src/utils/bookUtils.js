const Book = require('../models/bookModel');
const User = require('../models/userModel');


// ---------- Count User Reviews ----------
const countUserReviews = async (userId) => {
  return await Book.countDocuments({ "reviews.userId": userId });
};

// ---------- Get User Favorite Books ----------
const getUserFavorites = async (userId) => {
  const user = await User.findById(userId).populate('books.bookId');
  if (!user) throw new Error("User not found");

  // Remove null book references
  const originalLength = user.books.length;
  user.books = user.books.filter(book => book.bookId !== null);
  if (user.books.length !== originalLength) await user.save();

  // Return favorite books
  return user.books
      .filter(book => book.favorite)
      .map(book => book.bookId);
};
// ---------- Get User Currently Reading Books ----------
const getUserCurrentlyReading = async (userId) => {
  const user = await User.findById(userId).populate('books.bookId');
  if (!user) throw new Error("User not found");

  // Remove null book references
  const originalLength = user.books.length;
  user.books = user.books.filter(book => book.bookId !== null);
  if (user.books.length !== originalLength) await user.save();

  // Return favorite books
  return user.books
      .filter(book => book.currentlyReading)
      .map(book => book.bookId);
};



module.exports = {
  getUserFavorites,
  countUserReviews,
  getUserCurrentlyReading,
 
};