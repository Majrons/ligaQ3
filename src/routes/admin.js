const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

const adminAuth = (req, res, next) => {
    const adminSecret = process.env.ADMIN_SECRET; // Pobierz tajny klucz z pliku .env
    if (req.header('admin-secret') === adminSecret) {
        return next();
    } else {
        return res.status(403).json({ msg: 'Nieautoryzowany dostęp' });
    }
};

router.post('/create-user', adminAuth, async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: 'Użytkownik już istnieje' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: 'Użytkownik utworzony pomyślnie', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Błąd serwera' });
    }
});

module.exports = router;
