const mongoose = require("mongoose");

const IslandSchema = new mongoose.Schema({
	name_id: Number,
	level: Number,
	x: Number,
	y: Number,
});

const Island = mongoose.model("Island", IslandSchema);

module.exports = Island;
