const mongoose = require("mongoose");

const WorldDecorationSchema = new mongoose.Schema({
	x: Number,
	y: Number,
	type: String,
});

const WorldDecoration = mongoose.model(
	"WorldDecoration",
	WorldDecorationSchema
);

module.exports = WorldDecoration;
