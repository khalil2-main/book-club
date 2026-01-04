const Book = require('../models/bookModel');
const User = require('../models/userModel');


// ---------- Count User Reviews ----------
const getUserlikedBooks = async (userId) => {
 return await Book.find({
  reviews: {
    $elemMatch: {
      userId: userId,
      rating: { $gte: 2 }
    }
  }
});

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

  // Return Reading books
  return user.books
      .filter(book => book.currentlyReading)
      .map(book => book.bookId);
};

const extractPreferences = (books) => {
  const genreCount = {};
  const authorCount = {};
  const languageCount={};

  books.forEach(book => {
    // count genres
    book.genres.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });

    // count authors
    authorCount[book.author] = (authorCount[book.author] || 0) + 1;

     // count languages
     languageCount[book.language]=(languageCount[book.author] || 0) + 1;
  });
   

  return {
    genres: Object.keys(genreCount).sort(
      (a, b) => genreCount[b] - genreCount[a]
    ),
    authors: Object.keys(authorCount).sort(
      (a, b) => authorCount[b] - authorCount[a]
    ),
    languages: Object.keys(languageCount).sort(
      (a,b) => languageCount[a]-languageCount[b]
    )
  };
};
const getRecommendations = async (userId) => {

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Count reviews
  const likedBooks = await getUserlikedBooks(userId)

  // Count favorites
  const favoriteBooks = await getUserFavorites(userId);
  const totalSignals = likedBooks.length + favoriteBooks.length;
  const booksSignals= [...likedBooks , ...favoriteBooks];
  // Rule: minimum activity
  if (totalSignals <= 7) {
    return [];
  }

  
  // Extract preferences
  const { genres, authors, languages } = extractPreferences(booksSignals);

  // Exclude books user already has
  const excludedBookIds = user.books.map(b => b.bookId);

  // Find recommendations
  const recommendations = await Book.find({
    _id: { $nin: excludedBookIds },
    $or: [
      { genres: { $in: genres.slice(0, 3) } },
      { author: { $in: authors.slice(0, 3) } },
      {language:{$in: languages.slice(1,3)}}
    ]
  })
  .sort({avrageRating: -1 })   // most highly rated
  .limit(20);

  return recommendations;
};

module.exports = {
  getUserFavorites,

  getUserCurrentlyReading,
 getRecommendations,
};