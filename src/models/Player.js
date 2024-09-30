// models/Player.js
const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
});

module.exports = mongoose.model('Player', playerSchema);
