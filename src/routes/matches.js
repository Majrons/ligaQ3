// routes/matches.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const verifyRole = require('../middlewares/authMiddleware');

router.post('/', verifyRole(['admin', 'mod']), matchController.addMatch);
router.get('/', matchController.getAllMatches);
router.get('/team/:teamId', matchController.getMatchesByTeam);
router.get('/:id', matchController.getMatchById);
router.put('/:id', verifyRole(['admin']),  matchController.updateMatch);
router.delete('/:id', verifyRole(['admin']), matchController.deleteMatch);

module.exports = router;
