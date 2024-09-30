// controllers/playerController.js
const Player = require('../models/Player');
const Team = require('../models/Team');

exports.addPlayer = async (req, res) => {
    try {
        const { name, position, teamId, number } = req.body;

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Drużyna nie znaleziona' });

        const newPlayer = new Player({ name, position, team: teamId, number });
        await newPlayer.save();

        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się dodać gracza' });
    }
};

exports.getPlayersByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const players = await Player.find({ team: teamId });

        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać graczy' });
    }
};
