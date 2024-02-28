import { Client, Events, GatewayIntentBits, Options } from "discord.js";
require("dotenv").config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	sweepers: Options.DefaultSweeperSettings,
});

client.login(process.env.TOKEN);

process.on("SIGINT", async () => {
	const html_cleaner = await import("./src/modules/HTMLSCleaner");
	html_cleaner.default();
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
	const module = await import(`./src/modules/${file}`);
	return module.default(client);
});

await Promise.all(filePromises);
