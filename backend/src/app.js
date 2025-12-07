const express= require('express');
const db =require('./config/db');
const  routes = require('./routers/index');
const cookieParser = require('cookie-parser')
const path = require('path');

require('dotenv').config({quiet:true});

const app = express();
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// server port
const PORT=process.env.PORT|| 3000;



//connect to database
(async ()=>{
  try{
    await db.connect();
    app.use(express.json());
    app.use(cookieParser())


    app.use(routes);
    
    app.get('/',(req,res)=>{
      res.send('<h1> home page</h1>')
    })
    
    app.use((req, res)=>{
      res.status(404).json({Message: '404 route not found'});
    })
    app.listen(PORT,()=>{
     
      console.log(`running on port ${PORT}` )
    })
  } catch(err){
    console.error(`Failed to start server${err}`)
  }
})()

