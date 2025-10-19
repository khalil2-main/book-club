const {Router}=require('express');
const user = require('./user');



const routers=Router()


routers.use(user)


module.exports= routers;