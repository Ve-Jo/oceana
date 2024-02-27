import mongoose from "mongoose";

export default async function (client) {
	await mongoose.connect(process.env.MONGODB_URI).then(() => {
		console.log("Connected to MongoDB");
	});
	client.mongodb = mongoose;
}
