// db.js
const mongoose= require('mongoose'); // or: const mongoose = require('mongoose');

let instance = null; // holds our singleton instance
let isConnected = false;

class Database {
  constructor() {
    if (instance) return instance; // Singleton: return existing instance
    instance = this;
  }

  async connect(uri = 'mongodb://localhost:27017/BookClub') {
    if (isConnected) {
      console.log('✅ Already connected to MongoDB');
      return mongoose.connection;
    }

    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      isConnected = true;
      console.log(' MongoDB connected successfully');
      return mongoose.connection;
    } catch (error) {
      console.error(' MongoDB connection error:', error);
      throw error;
    }
  }

  getConnection() {
    if (!isConnected) {
      throw new Error(' Database not connected');
    }
    return mongoose.connection;
  }
}

const dbInstance = new Database();
;

// For CommonJS
module.exports = new Database();
