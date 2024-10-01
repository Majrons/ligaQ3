// controllers/playerController.js
const Player = require('../models/Player');

// controllers/playerController.js
exports.addPlayer = async (req, res) => {
    try {
        const { name, teamId } = req.body;
        const newPlayer = new Player({ name, teamId });
        await newPlayer.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się dodać gracza' });
    }
};


exports.deletePlayer = async (req, res) => {
    try {
        const { playerId } = req.params;
        const player = await Player.findByIdAndDelete(playerId);

        if (!player) {
            return res.status(404).json({ error: 'Gracz nie został znaleziony' });
        }

        res.status(200).json({ message: 'Gracz został usunięty' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się usunąć gracza' });
    }
};

exports.getPlayersByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const players = await Player.find({ teamId: teamId }).exec();

        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać graczy' });
    }
};
