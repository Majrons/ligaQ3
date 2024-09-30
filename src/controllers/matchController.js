// controllers/matchController.js
const Match = require('../models/Match');
const Team = require('../models/Team');

exports.addMatch = async (req, res) => {
    try {
        const { homeTeam, awayTeam, homeScore, awayScore } = req.body;

        const homeTeamExists = await Team.findById(homeTeam);
        const awayTeamExists = await Team.findById(awayTeam);

        if (!homeTeamExists || !awayTeamExists) {
            return res.status(404).json({ error: 'Jedna lub obie drużyny nie zostały znalezione' });
        }

        const newMatch = new Match({ homeTeam, awayTeam, homeScore, awayScore });
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
        res.status(500).json({ error: 'Nie udało się dodać meczu' });
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
        const { homeTeam, awayTeam, homeScore, awayScore, players } = req.body;

        const match = await Match.findById(id);
        if (!match) return res.status(404).json({ error: 'Mecz nie znaleziony' });

        match.homeTeam = homeTeam;
        match.awayTeam = awayTeam;
        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.players = players;

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

        res.status(200).json({ message: 'Mecz został usunięty' });
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się usunąć meczu' });
    }
};