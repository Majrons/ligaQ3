// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://liga-q3.pl'], // Dodaj URL swojej aplikacji front-endowej
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

connectDB();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/teams', require('./src/routes/teams'));
app.use('/api/matches', require('./src/routes/matches'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
