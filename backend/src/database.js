import mongoose from "mongoose";

let db = null;

export default {
	data: { db: db },
	async execute() {
		db = await mongoose.connect(process.env.MONGODB_URI);
	},
};
