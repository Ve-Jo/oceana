import { Client, GatewayIntentBits, Options } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path"

dotenv.config({path: path.resolve(process.cwd(), "./../.env")})

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	sweepers: Options.DefaultSweeperSettings,
});

client.login(process.env.TOKEN);

process.on("SIGINT", async () => {
	fs.rmdirSync("./temp", { recursive: true });
	process.exit(0);
});

const filePromises = [
	"EventsHandler",
	"CommandsHandler",
	"Localizator",
	"Mongoose",
	"ProcessUsage",
	/*"CanvasPrerender",*/
].map(async (file) => {
	const module = await import(`./src/modules/${file}.js`);
	return module.default(client);
});

async function run() {
	await Promise.all(filePromises);
}
run();
