const {Router}=require('express');
const User= require('./../models/userModel');
const Book = require('./../models/bookModel');
const validate = require('../middlewares/validate');
const { getUserCurrentlyReading, getUserFavorites,getRecommendations, getUserReviews}= require('../utils/bookUtils')
const { isParamValidator}= require('../validators/UservalidationSchema');
const router = Router();










//--books related routes--//

// add a book to favorite book list
router.patch('/addFav/:id',isParamValidator,validate, async(req,res)=>{
  try{const userId= req.userId;
  const bookId= req.params.id;
  const user= await  User.findById(userId)
  if(!user) return res.status(404).send({message : 'user not found'})
  
  const bookIndex= user.books.findIndex(
    (book=>book.bookId.toString()===bookId)
  );
  if(bookIndex!= -1){
    user.books[bookIndex].favorite= !user.books[bookIndex].favorite;
  }
  else{
    user.books.push({
        bookId,
      favorite: true,
      currentlyReading: false
    })
  }
  await user.save()
   res.status(200).json({
      message: 'Favorite status updated',
      books: user.books
    });
  
    res.status(200).send({user})
  }catch(err){
    console.err(err);
    return res.status(500).send('server error')
  }
})

//add to curently reading

router.patch('/addtoreading/:id',isParamValidator,validate, async(req,res)=>{
  try{const userId= req.userId;
  const bookId= req.params.id;
  const user= await  User.findById(userId)
  if(!user) return res.status(404).send({message : 'user not found'})
  
  bookIndex= user.books.findIndex(
    (book=>book.bookId.toString()===bookId)
  );
  if(bookIndex!= -1){
    user.books[bookIndex].currentlyReading= !user.books[bookIndex].currentlyReading;
  }
  else{
    user.books.push({
        bookId,
      favorite: false,
      currentlyReading: true
    })
  }
  await user.save()
   res.status(200).json({
      message: 'Favorite status updated',
      books: user.books
    });
  
    res.status(200).send({user})
  }catch(err){
    console.log(err);
    return res.status(500).send('server error')
  }
})

// get book stauts 
router.get('/book-status/:id',async(req,res)=>{
  try{
    const userId= req.userId;
  const bookId= req.params.id;
   const user=await User.findById(userId);
   if(!user)return res.status(404).send({message: 'User not found'})
    const bookIndex= user.books.findIndex(
      (book=>book.bookId.toString()===bookId)
    )
    if(bookIndex===-1) return res.status(404).send({messgae:'no staus related to this book'})
      res.status(200).send({currentlyReading:user.books[bookIndex].currentlyReading, 
    favorite:user.books[bookIndex].favorite})

  }
  catch(err){
     console.log(err);
    return res.status(500).send('server error')
  }
})

//  get favorites books
router.get('/books/favorites/:id', isParamValidator,validate, async (req, res) => {
  try {
    const userId = req.params.id;

    const favoriteBooks = await getUserFavorites(userId);

    if (favoriteBooks.length === 0) {
      return res.status(404).json({ message: 'No favorite books found' });
    }

    res.status(200).json({ favoriteBooks });

  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ message: err.message });
    }

    console.error(err);
    
    res.status(500).json({ message: 'Server error' });
  }
});


//  get currently reading books
router.get('/books/currentlyReading/:id', async (req, res) => {
  try {
    const userId = req.params.id;


    const readingBooks = await getUserCurrentlyReading(userId);
    if (!readingBooks ||readingBooks.length === 0) {
      return res.status(404).json({ message: "Haven't started reading yet" });
    }

    return res.status(200).json({ readingBooks });

  } catch (err) {
     if (err.message === 'User not found') {
      return res.status(404).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/CreatedBooks/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const books = await Book.find({ createdBy: userId });

    if (books.length === 0) {
      return res.status(404).json({
        message: 'You have not added any books'
      });
    }

    res.status(200).json({ books });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/books/reviews/:id',isParamValidator,  async (req, res)=>{
  try{
    const userId = req.params.id;
    const reviewedBooks= await getUserReviews(userId);
    if(!reviewedBooks|| reviewedBooks.lenght===0){
       return res.status(404).json({ message: "Haven't submit a review yet" });
    }
      return res.status(200).json({ reviewedBooks });

  }
  catch (err) {
     if (err.message === 'User not found') {
      return res.status(404).json({ message: err.message });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

})

router.get('/books/recommendations', async (req, res) => {
  try {
    const books = await getRecommendations(req.userId);
    res.json({ recommendations: books });
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message });
  }
});

module.exports= router;