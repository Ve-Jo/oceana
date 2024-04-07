import mongoose from "mongoose";
import { execute } from "./../../../database/index.js";

export default async function (client) {
	/*await mongoose.connect(process.env.MONGODB_URI).then(() => {
		console.log("Connected to MongoDB");
	});
	client.mongodb = mongoose;*/
	client.mongodb = await execute();
}
