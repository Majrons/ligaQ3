// controllers/teamController.js
const Team = require('../models/Team');
const Match = require('../models/Match');
const { exec } = require('child_process');
const path = require('path');

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

exports.updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body; // Odbieranie nazwy zespołu z body requestu
        const team = await Team.findByIdAndUpdate(id, { name }, { new: true });
        if (!team) return res.status(404).json({ error: 'Drużyna nie znaleziona' });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zaktualizować nazwy drużyny' });
    }
};

const backupDatabase = () => {
    const backupPath = path.join('/home/webartstudio/domains/liga-q3.pl/backups', `backup-${Date.now()}.gz`);
    const dbUri = process.env.DB_URI;

    const command = `mongodump --uri="${dbUri}" --gzip --archive=${backupPath}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Błąd podczas tworzenia zrzutu:', stderr);
                reject(error);
            } else {
                console.log('Zrzut bazy danych zapisany w:', backupPath);
                resolve(backupPath);
            }
        });
    });
};


exports.resetAllTeams = async (req, res) => {
    try {
        await backupDatabase();

        await Team.updateMany({}, { $set: { wins: 0, losses: 0, matchesPlayed: 0 } });
        await Match.deleteMany({});
        res.status(200).json({ message: 'Tabela została wyzerowana' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się wyzerować tabeli' });
    }
};
