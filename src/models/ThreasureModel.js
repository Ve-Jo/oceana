const mongoose = require("mongoose");

const ThreasureModel = new mongoose.model("Threasure", {
	x: { type: Number, required: true },
	y: { type: Number, required: true },
	level: { type: Number, required: true },
});

const Threasure = mongoose.model("Threasure", ThreasureModel);

module.exports = Threasure;
