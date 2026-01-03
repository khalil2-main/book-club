const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken')



const saltRound=10;

const hashPassword= (password)=>{
  const salt=  bcrypt.genSaltSync(saltRound);
  return bcrypt.hashSync(password,salt)
}

const comparePassword= (password, hashed)=>{
  return bcrypt.compareSync(password,hashed)
}


// create token
const creatToken=(id,maxAge)=>{
  return jwt.sign({id},process.env.TOKEN_KEY_SECRET ,{
    expiresIn:maxAge
  })
}



// calculate book rating
const recalculateRating = (book) => {
  const ratedReviews = book.reviews.filter(r => r.rating > 0);

  const ratingCount = ratedReviews.length;

  if (ratingCount === 0) {
    book.ratingCount = 0;
    book.averageRating = 0;
    return;
  }

  const ratingTotal = ratedReviews.reduce(
    (total, r) => total + r.rating,
    0
  );

  book.ratingCount = ratingCount;
  book.averageRating = Number((ratingTotal / ratingCount).toFixed(1));
};

module.exports={hashPassword, comparePassword, creatToken, recalculateRating}
