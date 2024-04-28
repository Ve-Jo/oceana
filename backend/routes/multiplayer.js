import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const dataFilePath = path.join(__dirname, "../data/players.json");

// Helper function to read data from JSON file
function readDataFromFile() {
	try {
		if (fs.existsSync(dataFilePath)) {
			const rawData = fs.readFileSync(dataFilePath);
			if (rawData.length === 0) {
				// Handle empty file
				return [];
			}
			return JSON.parse(rawData);
		} else {
			// File doesn't exist
			console.error("Data file does not exist:", dataFilePath);
			return [];
		}
	} catch (err) {
		console.error("Error reading data from file:", err);
		return [];
	}
}

// Helper function to write data to JSON file
function writeDataToFile(data) {
	try {
		fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
	} catch (err) {
		console.error("Error writing data to file:", err);
	}
}

router.get("/multiplayer", (req, res) => {
	try {
		console.log("Fetching all players from the file...");
		const players = readDataFromFile();
		console.log("Players retrieved successfully");
		console.log(players);
		res.json(players);
	} catch (err) {
		console.error("Error fetching players:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/multiplayer/:id", (req, res) => {
	try {
		console.log(`Fetching player with ID ${req.params.id} from the file...`);
		const players = readDataFromFile();
		const player = players.find((p) => p.user_id === req.params.id);
		if (!player) {
			console.log("Player not found");
			return res.status(404).json({ error: "Player not found" });
		}
		console.log("Player retrieved successfully");
		res.json(player);
	} catch (err) {
		console.error("Error fetching player:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/multiplayer", (req, res) => {
	try {
		console.log("Creating or updating player...");
		const { x, y, user_id, boat } = req.body;
		const players = readDataFromFile();
		const index = players.findIndex((p) => p.user_id === user_id);

		// If player doesn't exist, create a new one
		if (index === -1) {
			console.log("Creating a new player...");
			const updateTime = new Date();
			const player = {
				x,
				y,
				user_id,
				update_time: updateTime,
				boat,
			};
			players.push(player);
			writeDataToFile(players);
			console.log("Player created successfully");
			res.status(201).json(player);
		} else {
			console.log(`Updating player with ID ${user_id}...`);
			players[index].x = x;
			players[index].y = y;
			players[index].update_time = new Date();
			players[index].boat = boat;
			writeDataToFile(players);
			console.log("Player updated successfully");
			res.json(players[index]);
		}
	} catch (err) {
		console.error("Error creating or updating player:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.delete("/multiplayer/:id", (req, res) => {
	try {
		console.log(`Deleting player with ID ${req.params.id}...`);
		let players = readDataFromFile();
		players = players.filter((p) => p.user_id !== req.params.id);
		writeDataToFile(players);
		console.log("Player deleted successfully");
		res.sendStatus(204);
	} catch (err) {
		console.error("Error deleting player:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
