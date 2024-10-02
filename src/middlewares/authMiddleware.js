// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware sprawdzający rolę użytkownika
const verifyRole = (roles) => {
    return (req, res, next) => {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(401).json({ msg: 'Brak autoryzacji, token wymagany' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            return res.status(401).json({ msg: 'Nieprawidłowy token' });
        }

        // Znajdź użytkownika po ID z tokenu
        User.findById(req.user.id).then(user => {
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ msg: 'Brak uprawnień' });
            }
            next();
        });
    };
};

module.exports = verifyRole;