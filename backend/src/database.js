import mongoose from "mongoose";

export default {
	async execute() {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("Connected to MongoDB");
	},
};
