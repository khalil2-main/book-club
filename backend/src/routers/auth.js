const { Router } = require('express');
const User = require('../models/user');
const {matchedData,checkSchema, validationResult}= require('express-validator')
const {createUserValidatorsScheama,AuthUserValidatorsScheama} = require('../config/UservalidationSchema');
const { hashPassword, creatToken, erorrHandler } = require('../utils/helpers');

const router = Router();
const maxAge = 3 * 24 * 60 * 60; 


//   REGISTER USER
-
router.post('/register', checkSchema(createUserValidatorsScheama), async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    console.log('here'+result)
    const errors = erorrHandler(result);
    return res.status(400).send({ errors });
  }

  const data = matchedData(req);
  data.password = hashPassword(data.password);

  try {
    const newUser = new User(data);
    const savedUser = await newUser.save();

    const token = creatToken(savedUser._id,maxAge);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    return res.status(201).send(savedUser);
  } catch (err) {
    console.log(err)
    const errors = erorrHandler(err);
    return res.status(400).send({ errors });
  }
});


//      LOGIN

router.post('/login', checkSchema(AuthUserValidatorsScheama), async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = erorrHandler(result);
    return res.status(400).send({ errors });
  }

  const { email, password } = matchedData(req);

  try {
    const user = await User.login(email, password);

    const token = creatToken(user._id,maxAge);
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    return res.status(200).send({ user });
  } catch (err) {
    const errors = {};

    if (err.message === 'incorrect Email')
      errors.email = 'The email is not registered';

    if (err.message === 'incorrect password')
      errors.password = 'The password is incorrect';

    return res.status(400).send({ errors });
  }
});

// ----------------------
//      LOGOUT
// ----------------------
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).send('You have been logged out successfully');
});

module.exports = router;
