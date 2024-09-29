// routes/matches.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, matchController.addMatch);
router.get('/:teamId', matchController.getMatchesByTeam);

module.exports = router;
