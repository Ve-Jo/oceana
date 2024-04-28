import express from "express";

import User from "../models/UserModel.js";

const router = express.Router();

router.get("/users/:id", async (req, res) => {
	try {
		console.log(`Fetching user with ID ${req.params.id} from the database...`);
		const user = await User.findOne({ id: req.params.id });
		if (!user) {
			console.log("User not found");
			return res.status(404).json({ error: "User not found" });
		}
		console.log("User retrieved successfully");
		res.json(user);
	} catch (err) {
		console.error("Error fetching user:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.delete("/users/:id", async (req, res) => {
	try {
		console.log(`Deleting user with ID ${req.params.id}...`);
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			console.log("User not found");
			return res.status(404).json({ error: "User not found" });
		}
		console.log("User deleted successfully");
		res.sendStatus(204);
	} catch (err) {
		console.error("Error deleting user:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
