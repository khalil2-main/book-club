const {Router}=require('express');
const user = require('./user');
const auth = require('./auth');
const book = require('./book');
const profile= require('./profile')
const {requireAuth} = require('../middlewares/auth');




const routers=Router()



routers.use('/api',auth)
routers.use('/api/user',requireAuth,user)
routers.use('/api/user',requireAuth,profile)
routers.use('/api/book',book)



module.exports= routers;