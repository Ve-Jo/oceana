const mongoose = require("mongoose");

const BoatSchema = new mongoose.Schema({
	level: {
		type: Number,
		default: 1,
	},
	xp: {
		current: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 90,
		},
	},
	rotation: {
		type: Number,
		default: 0,
	},
	speed: {
		current: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 10,
		},
	},
	guns: {
		level: { type: Number, default: 0 },
		damage: { type: Number, default: 0 },
		range: { type: Number, default: 0 },
	},
	fishing_rod: {
		max_distance: {
			type: Number,
			default: 3,
		},
		durability: {
			current: {
				type: Number,
				default: 50,
			},
			max: {
				type: Number,
				default: 50,
			},
		},
	},
	cargo: {
		current: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 10,
		},
	},
	health: {
		current: {
			type: Number,
			default: 100,
		},
		max: {
			type: Number,
			default: 100,
		},
	},
});

const Boat = mongoose.model("Boat", BoatSchema);

module.exports = Boat;
