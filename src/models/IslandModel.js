const mongoose = require("mongoose");

const IslandModel = new mongoose.model("Island", {
	name: String,
	level: Number,
	x: Number,
	y: Number,
});

const Island = mongoose.model("Island", IslandModel);

module.exports = Island;
