const {Router}=require('express');
const user = require('./user');
const auth = require('./auth');
const {requireAuth} = require('../middlewares/auth');




const routers=Router()


routers.use('/api',auth)
routers.use('/api/user',requireAuth,user)



module.exports= routers;