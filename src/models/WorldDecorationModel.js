const mongoose = require("mongoose");

const WorldDecorationModel = new mongoose.model("WorldDecoration", {
	x: Number,
	y: Number,
	type: String,
});

const WorldDecoration = mongoose.model("WorldDecoration", WorldDecorationModel);

module.exports = WorldDecoration;
