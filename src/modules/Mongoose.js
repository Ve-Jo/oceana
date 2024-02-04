const mongoose = require("mongoose");

module.exports = async function (client) {
	await mongoose.connect(process.env.MONGODB_URI).then(() => {
		console.log("Connected to MongoDB");
	});
	client.mongodb = mongoose;
};
