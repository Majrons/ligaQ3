// config/db.js
const mongoose = require('mongoose');

const uri = process.env.DB_URI;
// const uri = process.env.DB_URI_TEST;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
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
