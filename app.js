// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/teams', require('./src/routes/teams'));
app.use('/api/matches', require('./src/routes/matches'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
