// routes/teams.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/', teamController.addTeam);
router.get('/', teamController.getTeams);
router.put('/:id', teamController.updateTeam);

module.exports = router;
