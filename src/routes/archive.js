const express = require('express');
const router = express.Router();
const verifyRole = require("../middlewares/authMiddleware");
const archiveController = require('../controllers/archiveController');


router.post('/', verifyRole(['uberAdmin', 'admin']), archiveController.archiveQuarter);
router.get('/archived-results', archiveController.getArchivedQuarters);
router.get('/archived-results/:quarter', archiveController.getArchivedResultsByQuarter);

module.exports = router;
