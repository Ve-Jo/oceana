import express from "express";
import dotenv from "dotenv";
import path from "path";

import databaseModule from "./src/database.js";
import apiModule from "./src/api.js";
import userRoutes from "./routes/users.js";
import multiplayerRoutes from "./routes/multiplayer.js";

dotenv.config({ path: path.resolve(process.cwd(), "./../.env") });

const app = express();
const port = 3001;

app.use(express.json());

(async () => {
	await apiModule.execute(app, port);
	await databaseModule.execute();

	app.use("/api", userRoutes);
	app.use("/api", multiplayerRoutes);
})();

export { app };
