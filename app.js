// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

// Połącz z bazą danych
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
app.use('/api/teams', require('./src/routes/teams'));
app.use('/api/matches', require('./src/routes/matches'));
app.use('/api/auth', require('./src/routes/auth'));

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
