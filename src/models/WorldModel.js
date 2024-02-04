const mongoose = require("mongoose");

const WorldModel = new mongoose.model("World", {
	level: Number,
	day: {
		current: Number,
		max: Number,
		cycle: Number,
	},
	weather: {
		running: Boolean,
		type: Number,
	},
	fishes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Fish",
		},
	],
});

const World = mongoose.model("World", WorldModel);

module.exports = World;
