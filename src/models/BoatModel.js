const mongoose = require("mongoose");

const BoatModel = new mongoose.model("Boat", {
	level: Number,
	xp: Number,
	xp_max: Number,
	rotation: Number,
	speed: {
		current: Number,
		max: Number,
	},
	cargo: {
		current: Number,
		max: Number,
	},
	health: {
		current: Number,
		max: Number,
	},
});

const Boat = mongoose.model("Boat", BoatModel);

module.exports = Boat;
