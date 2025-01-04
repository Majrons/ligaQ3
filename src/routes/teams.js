// routes/teams.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const verifyRole = require('../middlewares/authMiddleware');

router.post('/', teamController.addTeam);
router.get('/', teamController.getTeams);
router.put('/:id', verifyRole(['uberAdmin', 'admin']), teamController.updateTeam);
router.delete('/:id', verifyRole(['uberAdmin', 'admin']), teamController.deleteTeam);
router.get('/:id', teamController.getTeamById);
router.post('/reset', verifyRole(['uberAdmin']), teamController.resetAllTeams);
router.get('/match/:matchId', verifyRole(['uberAdmin', 'admin']), teamController.getTeamsByMatchId);

module.exports = router;
