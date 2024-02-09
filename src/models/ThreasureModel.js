const mongoose = require("mongoose");

const ThreasureSchema = new mongoose.Schema({
	x: { type: Number, required: true },
	y: { type: Number, required: true },
	level: { type: Number, required: true },
});

const Threasure = mongoose.model("Threasure", ThreasureSchema);

module.exports = Threasure;
