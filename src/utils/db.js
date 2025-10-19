const { MongoClient } = require("mongodb");

 let _db
module.exports={

  connectToDB:(cb)=>{
    MongoClient.connect('mongodb://localhost:27017/BookClub')
    .then(client =>{
      _db= client.db();
      return cb();
    })
    .catch((err)=>{
      console.error(err);
      return cb(err);
    })
  },
  getDB:()=>{
    if(!_db) throw new Error("Data base not connected");
    return _db
    
  }

}