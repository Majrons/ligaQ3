// routes/matches.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const matchController = require('../controllers/matchController');
const verifyRole = require('../middlewares/authMiddleware');

// Ustawienia multer do przechowywania przesłanych plików
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Przechowywanie plików w folderze 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unikalna nazwa pliku
    }
});
const upload = multer({ storage: storage });

// Trasy związane z meczami
router.post(
    '/',
    verifyRole(['admin', 'mod']),
    upload.fields([{ name: 'screenshot1' }, { name: 'screenshot2' }]),
    matchController.addMatch
);
router.get('/', matchController.getAllMatches);
router.get('/team/:teamId', matchController.getMatchesByTeam);
router.get('/:id', matchController.getMatchById);
router.put(
    '/:id',
    verifyRole(['admin']),
    upload.fields([{ name: 'screenshot1' }, { name: 'screenshot2' }]),
    matchController.updateMatch
);
router.delete('/:id', verifyRole(['admin']), matchController.deleteMatch);
router.get('/tdm', matchController.getTdmMatches);
router.get('/ctf', matchController.getCtfMatches);

module.exports = router;
