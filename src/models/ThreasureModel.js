const mongoose = require("mongoose");

const ThreasureModel = new mongoose.model("Threasure", {
	x: Number,
	y: Number,
	level: Number,
});

const Threasure = mongoose.model("Threasure", ThreasureModel);

module.exports = Threasure;
