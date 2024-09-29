const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware autoryzacji - tylko admin
const adminAuth = (req, res, next) => {
    const adminSecret = process.env.ADMIN_SECRET; // Użyj zmiennej środowiskowej ADMIN_SECRET
    if (req.header('admin-secret') === adminSecret) {
        return next();
    } else {
        return res.status(403).json({ error: 'Nieautoryzowany dostęp' });
    }
};

// Endpoint do dodawania użytkowników (tylko dla administratora)
router.post('/create-user', adminAuth, adminController.createUser);

module.exports = router;
