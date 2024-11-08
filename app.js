const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./src/config/db');
const path = require('path');

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

app.use('/uploads', express.static(path.join(__dirname, 'public_nodejs/uploads')));
app.use('/api/teams', require('./src/routes/teams'));
app.use('/api/matches', require('./src/routes/matches'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/players', require('./src/routes/players'));
app.use((req, res, next) => {
    console.log(`Żądanie: ${req.method} ${req.url}`);
    next();
});

// Uruchomienie serwera
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
