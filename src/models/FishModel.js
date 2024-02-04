const mongoose = require("mongoose");

const FishModel = new mongoose.model("Fish", {
	type: String,
	weight: Number,
	value: Number,
	level: Number,
	rarity: Number,
});

const Fish = mongoose.model("Fish", FishModel);

module.exports = Fish;
