const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Zakładam, że masz już model User

// Dodawanie użytkownika
exports.createUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Sprawdź, czy użytkownik o takiej nazwie już istnieje
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Użytkownik już istnieje' });
        }

        // Hashuj hasło
        const hashedPassword = await bcrypt.hash(password, 10);

        // Utwórz nowego użytkownika
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Użytkownik utworzony pomyślnie', user: newUser });
    } catch (error) {
        console.error('Błąd podczas dodawania użytkownika:', error);
        res.status(500).json({ error: 'Błąd serwera' });
    }
};
