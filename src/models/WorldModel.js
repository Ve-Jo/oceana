import ms from "ms";

const mongoose = require("mongoose");

const WorldModel = new mongoose.model("World", {
	level: {
		type: Number,
		default: 1,
	},
	xp: {
		type: Number,
		default: 0,
	},
	xp_max: {
		type: Number,
		default: 40,
	},
	day: {
		current: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 120,
		},
		cycle: { type: Number, default: 0 },
	},
	weather: {
		running: { type: Boolean, default: false },
		will_run: {
			type: Date,
			default: Date.now + ms("5m"),
		},
		type: { type: Number, default: 0 },
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
