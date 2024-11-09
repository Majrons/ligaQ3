// controllers/matchController.js
const Match = require('../models/Match');
const Team = require('../models/Team');

exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find().populate('homeTeam awayTeam', 'name');
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać wszystkich meczów' });
    }
};

exports.addMatch = async (req, res) => {
    try {
        const { homeTeam, awayTeam, homeScore, awayScore, gameType, homePlayers, awayPlayers } = req.body;

        const homeTeamExists = await Team.findById(homeTeam);
        const awayTeamExists = await Team.findById(awayTeam);

        if (!homeTeamExists || !awayTeamExists) {
            return res.status(404).json({ error: 'Jedna lub obie drużyny nie zostały znalezione' });
        }

        // Przygotowanie nowego meczu z danymi graczy i screenshotami
        const newMatch = new Match({
            homeTeam,
            awayTeam,
            homeScore,
            awayScore,
            gameType,
            homePlayers: JSON.parse(homePlayers),
            awayPlayers: JSON.parse(awayPlayers),
            screenshot1: req.files['screenshot1'] ? req.files['screenshot1'][0].path : null,
            screenshot2: req.files['screenshot2'] ? req.files['screenshot2'][0].path : null,
            screenshot3: req.files['screenshot3'] ? req.files['screenshot3'][0].path : null,
        });

        await newMatch.save();

        // Aktualizacja statystyk drużyn
        if (homeScore > awayScore) {
            homeTeamExists.wins += 1;
            awayTeamExists.losses += 1;
        } else if (homeScore < awayScore) {
            awayTeamExists.wins += 1;
            homeTeamExists.losses += 1;
        }

        homeTeamExists.matchesPlayed += 1;
        awayTeamExists.matchesPlayed += 1;

        await awayTeamExists.save();
        await homeTeamExists.save();

        res.status(201).json(newMatch);
    } catch (error) {
        console.error('Błąd podczas dodawania meczu:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate('homeTeam awayTeam');
        if (!match) return res.status(404).json({ error: 'Mecz nie znaleziony' });
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
};

exports.getMatchesByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const matches = await Match.find({
            $or: [{ homeTeam: teamId }, { awayTeam: teamId }],
        }).populate('homeTeam awayTeam', 'name');

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać meczów dla drużyny' });
    }
};

exports.updateMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const { homeTeam, awayTeam, homeScore, awayScore, gameType, homePlayers, awayPlayers } = req.body;

        const match = await Match.findById(id);
        if (!match) return res.status(404).json({ error: 'Mecz nie znaleziony' });

        // Aktualizacja pól meczu
        match.homeTeam = homeTeam;
        match.awayTeam = awayTeam;
        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.gameType = gameType;
        match.homePlayers = JSON.parse(homePlayers);
        match.awayPlayers = JSON.parse(awayPlayers);

        // Aktualizacja screenshotów (jeśli są przesłane)
        if (req.files['screenshot1']) match.screenshot1 = req.files['screenshot1'][0].path;
        if (req.files['screenshot2']) match.screenshot2 = req.files['screenshot2'][0].path;
        if (req.files['screenshot3']) match.screenshot3 = req.files['screenshot3'][0].path;

        await match.save();
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zaktualizować meczu' });
    }
};


exports.deleteMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await Match.findByIdAndDelete(id);

        if (!match) {
            return res.status(404).json({ error: 'Nie znaleziono meczu' });
        }

        // Aktualizuj statystyki drużyn
        const homeTeam = await Team.findById(match.homeTeam);
        const awayTeam = await Team.findById(match.awayTeam);

        if (homeTeam && awayTeam) {
            homeTeam.matchesPlayed -= 1;
            awayTeam.matchesPlayed -= 1;

            if (match.homeScore > match.awayScore) {
                homeTeam.wins -= 1;
                awayTeam.losses -= 1;
            } else if (match.homeScore < match.awayScore) {
                homeTeam.losses -= 1;
                awayTeam.wins -= 1;
            }

            await homeTeam.save();
            await awayTeam.save();
        }

        res.status(200).json({ message: 'Mecz został usunięty' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się usunąć meczu' });
    }
};


exports.getTdmMatches = async (req, res) => {
    try {
        const tdmMatches = await Match.find({ gameType: 'TDM' });
        res.status(200).json(tdmMatches);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera podczas pobierania meczów TDM' });
    }
};

// Pobieranie meczów typu CTF
exports.getCtfMatches = async (req, res) => {
    try {
        const ctfMatches = await Match.find({ gameType: 'CTF' });
        res.status(200).json(ctfMatches);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera podczas pobierania meczów CTF' });
    }
};