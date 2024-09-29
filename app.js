const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const username = encodeURIComponent('mo1028_ligaq3');
const password = encodeURIComponent('@!L1g4Q3$#!!');
const host = 's49.mydevil.net';
const port = '27017';
const database = 'mo1028_ligaq3';

const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Połączono z istniejącą bazą danych MongoDB'))
    .catch((err) => console.error('Błąd połączenia z bazą danych:', err));


const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
});

const Team = mongoose.model('Team', teamSchema);

const matchSchema = new mongoose.Schema({
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Match = mongoose.model('Match', matchSchema);

app.post('/teams', async (req, res) => {
    try {
        const { name } = req.body;
        const newTeam = new Team({ name });
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się dodać drużyny' });
    }
});

app.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać drużyn' });
    }
});

app.put('/teams/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { wins, losses } = req.body;
        const team = await Team.findByIdAndUpdate(id, { wins, losses, matchesPlayed: wins + losses }, { new: true });
        if (!team) return res.status(404).json({ error: 'Drużyna nie znaleziona' });
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się zaktualizować wyników' });
    }
});

app.post('/matches', async (req, res) => {
    try {
        const { homeTeam, awayTeam, homeScore, awayScore } = req.body;

        const homeTeamExists = await Team.findById(homeTeam);
        const awayTeamExists = await Team.findById(awayTeam);
        if (!homeTeamExists || !awayTeamExists) {
            return res.status(404).json({ error: 'Jedna lub obie drużyny nie zostały znalezione' });
        }

        const newMatch = new Match({ homeTeam, awayTeam, homeScore, awayScore });
        await newMatch.save();

        if (homeScore > awayScore) {
            homeTeamExists.wins += 1;
            awayTeamExists.losses += 1;
        } else if (homeScore < awayScore) {
            awayTeamExists.wins += 1;
            homeTeamExists.losses += 1;
        }

        homeTeamExists.matchesPlayed += 1;
        awayTeamExists.matchesPlayed += 1;

        await homeTeamExists.save();
        await awayTeamExists.save();

        res.status(201).json(newMatch);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się dodać meczu' });
    }
});

app.get('/matches/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const matches = await Match.find({
            $or: [{ homeTeam: teamId }, { awayTeam: teamId }],
        }).populate('homeTeam awayTeam', 'name');

        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Nie udało się pobrać meczów dla drużyny' });
    }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));
