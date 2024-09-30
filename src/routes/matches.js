// routes/matches.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, matchController.addMatch);
router.get('/team/:teamId', matchController.getMatchesByTeam);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;
