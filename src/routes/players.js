// routes/players.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Endpoint do dodawania nowego gracza
router.post('/', playerController.addPlayer);

// Endpoint do pobierania graczy z danej drużyny
router.get('/team/:teamId', playerController.getPlayersByTeam);

module.exports = router;
