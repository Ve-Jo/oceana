const mongoose = require("mongoose");

const BoatModel = new mongoose.model("Boat", {
	level: Number,
	xp: Number,
	xp_max: Number,
	rotation: Number,
	speed: Number,
	guns: {
		level: Number,
		damage: Number,
		range: Number,
	},
	fishing_rod: {
		max_distance: Number,
		durability: Number,
		durability_max: Number,
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
