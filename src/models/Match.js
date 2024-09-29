// models/Match.js
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    homeTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);
