const mongoose = require("mongoose");

const FishModel = new mongoose.model("Fish", {
	type: Number,
	weight: Number,
	value: Number,
	level: Number,
	rarity: Number,
});

const Fish = mongoose.model("Fish", FishModel);

module.exports = Fish;
