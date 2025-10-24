const express= require('express');
const db =require('./utils/db.js');
const  routes = require('./routers/index');

const passport = require('./utils/local-strategy.js');
const app = express();

// server port
const PORT=process.env.PORT|| 3000;



//connect to database
(async ()=>{
  try{
    await db.connect();
    app.use(express.json());
    app.use(passport.initialize());
    // app.use(passport.session())
    app.use(routes);
    
    app.get('/',(req,res)=>{
      res.send('<h1> home page</h1>')
    })
    //authentication
    app.post('/api/auth', passport.authenticate('local', { session: false }), (req ,res)=>{
    console.log(req.body)
    res.end()
  })
    app.use((req, res)=>{
      res.status(404).json({Message: '404 route not found'});
    })
    app.listen(PORT,()=>{
      console.log(`running on port ${PORT}` )
    })
  } catch(err){
    console.error('Failed to start server, err')
  }
})()

