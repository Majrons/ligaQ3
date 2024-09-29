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
