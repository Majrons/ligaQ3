const ArchivedResults = require('../models/ArchivedResults');
const Team = require('../models/Team');
const Match = require('../models/Match');
const Player = require('../models/Player');
const teamController = require('../controllers/teamController');

exports.archiveQuarter = async (req, res) => {
    const { quarter, teams, matches } = req.body;

    if (!quarter || typeof quarter !== 'string') {
        return res.status(400).json({ error: 'Nieprawidłowa nazwa kwartału' });
    }

    try {
        await teamController.backupDatabase();
        if (teams.length === 0 || matches.length === 0) {
            return res.status(404).json({ error: 'Brak danych do archiwizacji' });
        }

        // Pobierz graczy dla każdego zespołu
        const teamsWithPlayers = await Promise.all(
            teams.map(async team => {
                const players = await Player.find({ teamId: team._id }).exec();
                return {
                    _id: team._id,
                    name: team.name,
                    wins: team.wins,
                    losses: team.losses,
                    matchesPlayed: team.matchesPlayed,
                    players: players.map(player => ({
                        _id: player._id,
                        name: player.name,
                    })),
                };
            })
        );

        const archive = new ArchivedResults({
            quarter: quarter,
            teams: teamsWithPlayers,
            matches: matches.map(match => ({
                homeTeam: {
                    _id: match.homeTeam._id,
                    name: match.homeTeam.name,
                },
                awayTeam: {
                    _id: match.awayTeam._id,
                    name: match.awayTeam.name,
                },
                homeScore: match.homeScore,
                awayScore: match.awayScore,
                gameType: match.gameType,
                homePlayers: match.homePlayers,
                awayPlayers: match.awayPlayers,
                screenshot1: match.screenshot1,
                screenshot2: match.screenshot2,
                screenshot3: match.screenshot3,
                date: match.date,
            })),
        });

        await archive.save();

        // Usuwanie danych po archiwizacji
        await Team.deleteMany();
        await Match.deleteMany();
        await Player.deleteMany();

        res.status(200).json(archive);
    } catch (err) {
        console.error('Błąd podczas archiwizowania danych:', err);
        res.status(500).json({ error: 'Błąd podczas archiwizowania danych', details: err.message });
    }
};



exports.getArchivedQuarters = async (req, res) => {
    try {
        const quarters = await ArchivedResults.find().select('quarter -_id');

        res.status(200).json(quarters.map(q => q.quarter));
        return quarters.map(q => q.quarter);
    } catch (err) {
        console.error("Błąd podczas pobierania kwartałów:", err);
        res.status(500).json({ error: "Błąd podczas pobierania kwartałów:", err});
        throw new Error('Błąd podczas pobierania kwartałów: ' + err.message);
    }
};

exports.getArchivedResultsByQuarter = async (req, res) => {
    const { quarter } = req.params;

    if (!quarter || typeof quarter !== 'string') {
        throw new Error('Nieprawidłowy kwartał');
    }

    try {
        const archive = await ArchivedResults.findOne({ quarter });

        if (!archive) {
            throw new Error('Nie znaleziono danych dla podanego kwartału');
        }

        res.status(200).json(archive);
        return archive;
    } catch (err) {
        console.error("Błąd podczas pobierania danych archiwalnych:", err);
        res.status(500).json({ error: "Błąd podczas pobierania danych archiwalnych:", err});
        throw new Error('Błąd podczas pobierania danych archiwalnych: ' + err.message);
    }
};