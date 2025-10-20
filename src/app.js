const express= require('express');
const db =require('./utils/db.js');
const  routes = require('./routers/index');
const app = express();

// server port
const PORT=process.env.PORT|| 3000;



//connect to database
(async ()=>{
  try{
    await db.connect();
    app.use(express.json())
    app.use(routes)
    app.listen(PORT,()=>{
      console.log(`running on port ${PORT}` )
    })
  } catch(err){
    console.error('Failed to start server, err')
  }
})()

