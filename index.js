import { Client, GatewayIntentBits, Options } from "discord.js";
import "dotenv/config";

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	sweepers: Options.DefaultSweeperSettings,
});

client.login(process.env.TOKEN);

process.on("SIGINT", async () => {
	const html_cleaner = await import("./src/modules/HTMLSCleaner");
	await html_cleaner.default();
	process.exit(0);
});

const filePromises = [
	"EventsHandler",
	"CommandsHandler",
	"Localizator",
	"Mongoose",
	"Browser",
	"ProcessUsage",
	"Caching",
].map(async (file) => {
	const module = await import(`./src/modules/${file}.js`);
	return module.default(client);
});

async function run() {
	await Promise.all(filePromises);

	if (process.env.CANVAS_PRERENDER === "true") {
		await import("./canvas").default;
	}
}
run();
