const express= require('express');
const {connectToDB, getDB} =require('./utils/db');
const  routes = require('./routers/index');
const app = express();

// server port
const PORT=process.env.PORT|| 3000;
let db;

//

//connect to database
connectToDB((err)=>{
  if(!err){
    
    //intialize server
    app.listen(PORT,()=>{
      console.log(`running on port ${PORT}` )
    })
    
    app.use(routes) 
    db=getDB()
  }
})

