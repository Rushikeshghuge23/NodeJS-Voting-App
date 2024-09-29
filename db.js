const mongoose = require('mongoose');
require('dotenv').config();

//define the mongoDB connection URL 
const mongoURL = process.env.MONGODB_URL_LOCAL;
//const mongoURL = process.env.MONGODB_URL;

//set up mongoDB connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//get default connection
const db = mongoose.connection;

//define event listeners for database connection
db.on('connected', () => {
    console.log('Connectd to MongoDB server');
})

db.on('error', (err) => {
    console.error('MongoDB connection error',err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnectd');
})

module.exports = db;