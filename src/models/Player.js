// models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String }, // opcjonalnie np. 'napastnik', 'obrońca', itp.
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    number: { type: Number } // numer na koszulce
});

module.exports = mongoose.model('Player', playerSchema);
