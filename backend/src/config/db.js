const mongoose = require('mongoose');

let instance = null; // Singleton instance
let isConnected = false;

class Database {
  constructor() {
    if (instance) return instance; // Return existing instance
    instance = this;
  }

  async connect(uri = process.env.MONGO_URI) {
    if (isConnected) {
      console.log('Already connected to MongoDB');
      return mongoose.connection;
    }

    try {
     
      await mongoose.connect(uri);

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
      throw new Error('❌ Database not connected');
    }
    return mongoose.connection;
  }
}


module.exports = new Database();
