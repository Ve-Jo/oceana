const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

let latest_lang;

const client = new Client({
	intents: [GatewayIntentBits.GuildMessages],
});

client.on(Events.ClientReady, () => {
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
			}
			if (type === "isCommand") {
				command = client.commands.get(interaction.commandName);
				if (!command) break;
				try {
					await command.execute(client, interaction);
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
	await require("./src/modules/HTMLSCleaner")();
	process.exit(0);
});

for (const file of [
	"Browser",
	"Mongoose",
	"CommandsHandler",
	"Slashes",
	"Localizator",
]) {
	await require(`./src/modules/${file}`)(client);
}
