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
                homePlayers: [{ type: String }],
                awayPlayers: [{ type: String }],
                gameType: { type: String, enum: ['TDM', 'CTF'], required: false },
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
