// routes/players.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const verifyRole = require('../middlewares/authMiddleware');

// Endpoint do dodawania nowego gracza
router.post('/', verifyRole, playerController.addPlayer);

// Endpoint do pobierania graczy z danej drużyny
router.get('/team/:teamId', playerController.getPlayersByTeam);

router.delete('/:playerId', verifyRole, playerController.deletePlayer);

module.exports = router;
