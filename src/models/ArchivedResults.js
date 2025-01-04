const mongoose = require('mongoose');

const archivedResultsSchema = new mongoose.Schema(
    {
        quarter: {
            type: String, // ex. "Q4 2024"
            required: true,
        },
        teams: [
            {
                name: { type: String, required: true },
                wins: { type: Number, default: 0 },
                losses: { type: Number, default: 0 },
                matchesPlayed: { type: Number, default: 0 },
                players: [
                    {
                        _id: mongoose.Schema.Types.ObjectId,
                        name: String,
                    },
                ],
            },
        ],
        matches: [
            {
                homeTeam: {
                    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
                    name: { type: String, required: true },
                },
                awayTeam: {
                    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
                    name: { type: String, required: true },
                },
                homeScore: { type: Number, required: true },
                awayScore: { type: Number, required: true },
                homePlayers: [{ type: mongoose.Schema.Types.String, ref: 'Player' }],
                awayPlayers: [{ type: mongoose.Schema.Types.String, ref: 'Player' }],
                gameType: { type: String, enum: ['TDM', 'CTF'], required: false },
                screenshot1: { type: String, default: null },
                screenshot2: { type: String, default: null },
                screenshot3: { type: String, default: null },
                date: {
                    type: Date,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const ArchivedResults = mongoose.model('ArchivedResults', archivedResultsSchema);

module.exports = ArchivedResults;
