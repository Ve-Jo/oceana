const mongoose = require("mongoose");

const WorldModel = new mongoose.model("World", {
	level: Number,
	xp: Number,
	xp_max: Number,
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
	islands: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Island",
		},
	],
	threasures: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Threasure",
		},
	],
	world_decorations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "WorldDecoration",
		},
	],
});

const World = mongoose.model("World", WorldModel);

module.exports = World;
