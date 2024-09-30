// config/db.js
const mongoose = require('mongoose');

const dbUsername = encodeURIComponent('mo1028_ligaq3');
const dbPassword = encodeURIComponent('@!L1g4Q3$#!!');
const dbHost = 's49.mydevil.net';
const dbName = 'mo1028_ligaq3';

const DB_URI = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:27017/${dbName}`;

// const uri = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Połączono z istniejącą bazą danych MongoDB');
    } catch (error) {
        console.error('Błąd połączenia z bazą danych:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
