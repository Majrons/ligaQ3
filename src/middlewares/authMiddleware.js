// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'supersecretkey'; // W produkcji umieść w zmiennych środowiskowych

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'Brak autoryzacji, token wymagany' });

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Nieprawidłowy token' });
    }
};

module.exports = authMiddleware;
