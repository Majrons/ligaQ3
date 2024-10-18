const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware sprawdzający token i rolę użytkownika
const verifyRole = (roles) => {
    return async (req, res, next) => {
        const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
        if (!token) return res.status(401).json({ msg: 'Brak autoryzacji, token wymagany' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Sprawdzenie, czy token nie wygasł
            if (decoded.exp * 1000 < Date.now()) {
                return res.status(401).json({ msg: 'Sesja wygasła, zaloguj się ponownie' });
            }

            req.user = decoded;

            // Znajdź użytkownika w bazie
            const user = await User.findById(req.user.id);
            if (!user || !roles.includes(user.role)) {
                return res.status(403).json({ msg: 'Brak uprawnień' });
            }

            next(); // Użytkownik ma odpowiednią rolę, kontynuujemy
        } catch (error) {
            return res.status(401).json({ msg: 'Nieprawidłowy token' });
        }
    };
};

module.exports = verifyRole;