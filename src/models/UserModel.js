const mongoose = require("mongoose");

const UserModel = new mongoose.model("User", {
	started_playing: {
		type: Date,
		default: Date.now,
	},
	id: Number,
	x: Number,
	y: Number,
	money: Number,
	level: Number,
	diamonds: Number,
	xp: {
		current: Number,
		max: Number,
	},
	boat: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Boat",
	},
	world: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "World",
	},
});

const User = mongoose.model("User", UserModel);

module.exports = User;
