// routes/teams.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', teamController.addTeam);
router.get('/', teamController.getTeams);
router.put('/:id', teamController.updateTeam);
router.get('/:id', teamController.getTeamById);
router.post('/reset', authMiddleware, teamController.resetAllTeams);

module.exports = router;
