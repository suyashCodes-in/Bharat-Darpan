const mongoose = require('mongoose');
const env = require('../config/env');

async function connectDB() {
  await mongoose.connect(env.MONGO_URI);
  console.log('connected to DB');
}

module.exports = connectDB;
