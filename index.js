import { Client, Events, GatewayIntentBits, Options } from "discord.js";
require("dotenv").config();

let latest_lang;

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
	sweepers: Options.DefaultSweeperSettings,
});

client.on(Events.ClientReady, (client) => {
	console.log("Bot is ready");
});

client.on(Events.InteractionCreate, async (interaction) => {
	let command;

	const interactionTypes = [
		"isCommand",
		"isButton",
		"isStringSelectMenu",
		"isAutocomplete",
	];
	for (let i = 0; i < interactionTypes.length; i++) {
		const type = interactionTypes[i];
		if (interaction[type]()) {
			if (latest_lang !== interaction.locale) {
				client.i18n.setLocale(interaction.locale);
				latest_lang = interaction.locale;
				console.log("Locale is set to " + interaction.locale);
			}
			if (type === "isCommand") {
				command = client.commands.get(interaction.commandName);
				if (!command) break;
				try {
					await command.execute({ client, interaction });
				} catch (error) {
					console.error(error);
				}
			}
			break;
		}
	}
});

client.login(process.env.TOKEN);

process.on("SIGINT", async () => {
	const html_cleaner = await import("./src/modules/HTMLSCleaner");
	html_cleaner.default();
	process.exit(0);
});

const filePromises = [
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
