// routes/players.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authMiddleware = require('../middlewares/authMiddleware');

// Endpoint do dodawania nowego gracza
router.post('/', authMiddleware, playerController.addPlayer);

// Endpoint do pobierania graczy z danej drużyny
router.get('/team/:teamId', playerController.getPlayersByTeam);

router.delete('/team/:playerId', playerController.deletePlayer);

module.exports = router;
