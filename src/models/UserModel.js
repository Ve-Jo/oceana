import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const UserSchema = new mongoose.Schema({
	id: { type: Number, required: true, unique: true },
	ui_updated: { type: Number, default: 0, required: true },
	started_playing: {
		type: Date,
		default: Date.now(),
	},
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
	/*energy: {
		current: {
			type: Number,
			default: 20,
		},
		max: {
			type: Number,
			default: 20,
		},
	},*/
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
		autopopulate: true,
	},
	world: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "World",
		autopopulate: true,
	},
	upgrades: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Upgrades",
		autopopulate: true,
	},
});

UserSchema.plugin(autopopulate);

const User = mongoose.model("User", UserSchema);

export default User;
