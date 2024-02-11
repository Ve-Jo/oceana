const mongoose = require("mongoose");
const ms = require("ms");

const WorldSchema = new mongoose.Schema({
	world_for_id: {
		type: Number,
		required: true,
		unique: true,
	},
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
			default: Date.now() + ms("5m"),
		},
		type: { type: Number, default: 0 },
	},
	fishes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Fish",
			autocomplete: true,
		},
	],
	islands: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Island",
			autocomplete: true,
		},
	],
	threasures: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Threasure",
			autocomplete: true,
		},
	],
	world_decorations: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "WorldDecoration",
			autocomplete: true,
		},
	],
});

const World = mongoose.model("World", WorldSchema);

module.exports = World;
