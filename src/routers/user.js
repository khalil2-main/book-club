const { Router } = require('express');
const { getDB } = require('../utils/db');

const UserRouter = Router();

UserRouter.get('/api/users', async (req, res) => {
    db=getDB()
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  
});

module.exports= UserRouter;
