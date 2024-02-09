const mongoose = require("mongoose");

const FishSchema = new mongoose.Schema({
	type: Number,
	weight: Number,
	value: Number,
	level: Number,
	rarity: Number,
});

const Fish = mongoose.model("Fish", FishSchema);

module.exports = Fish;
