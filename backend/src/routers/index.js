const {Router}=require('express');
const user = require('./user');
const requireAuth = require('../middlewares/auth');



const routers=Router()


routers.use(user)
routers.use(requireAuth)

//comment
module.exports= routers;