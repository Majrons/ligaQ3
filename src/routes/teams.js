// routes/teams.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const verifyRole = require('../middlewares/authMiddleware');

router.post('/', teamController.addTeam);
router.get('/', teamController.getTeams);
router.put('/:id', verifyRole(['admin']), teamController.updateTeam);
router.get('/:id', teamController.getTeamById);
router.post('/reset', verifyRole(['admin']), teamController.resetAllTeams);

module.exports = router;
