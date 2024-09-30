// controllers/teamController.js
const Team = require('../models/Team');

exports.addTeam = async (req, res) => {
    try {
        const { name } = req.body;
        const newTeam = new Team({ name });
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się dodać drużyny' });
    }
};

exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        console.log({
            errorZControllersTeam: error,
        })
        res.status(500).json({ error: 'Nie udało się pobrać drużyn' });
    }
};

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { wins, losses } = req.body;
        const team = await Team.findByIdAndUpdate(id, { wins, losses, matchesPlayed: wins + losses }, { new: true });
        if (!team) return res.status(404).json({ error: 'Drużyna nie znaleziona' });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zaktualizować wyników' });
    }
};

exports.getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id);
        if (!team) return res.status(404).json({ error: 'Drużyna nie znaleziona' });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
};
