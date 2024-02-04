const mongoose = require("mongoose");

const UserModel = new mongoose.model("User", {
	started_playing: {
		type: Date,
		default: Date.now,
	},
	id: Number,
	x: {
		type: Number,
		default: 0,
	},
	y: {
		type: Number,
		default: 0,
	},
	money: {
		type: Number,
		default: 0,
	},
	level: {
		type: Number,
		default: 1,
	},
	energy: {
		current: {
			type: Number,
			default: 20,
		},
		max: {
			type: Number,
			default: 20,
		},
	},
	diamonds: {
		type: Number,
		default: 0,
	},
	xp: {
		current: {
			type: Number,
			default: 0,
		},
		max: {
			type: Number,
			default: 120,
		},
	},
	boat: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Boat",
	},
	world: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "World",
	},
	upgrades: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Upgrades",
	},
});

const User = mongoose.model("User", UserModel);

module.exports = User;
