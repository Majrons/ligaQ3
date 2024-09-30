// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const secretKey = process.env.JWT_SECRET;

exports.registerUser = [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { username, password } = req.body;
            let user = await User.findOne({ username });
            if (user) return res.status(400).json({ msg: 'Użytkownik już istnieje' });

            user = new User({ username, password });
            await user.save();

            const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ msg: 'Błąd serwera' });
        }
    }
];

exports.loginUser = [
    body('username').exists(),
    body('password').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.status(400).json({ msg: 'Nieprawidłowe dane' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Nieprawidłowe dane' });

            const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ msg: 'Błąd serwera' });
        }
    }
];
