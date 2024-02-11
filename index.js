const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();

const client = new Client({
	intents: [GatewayIntentBits.GuildMessages],
});

client.on(Events.ClientReady, () => {
	console.log("Bot is ready");
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		/*await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});*/
	}
});

client.login(process.env.TOKEN);

process.on("SIGINT", async () => {
	await require("./src/modules/HTMLSCleaner")();
	process.exit(0);
});

for (const file of ["Browser", "Mongoose", "CommandsHandler", "Slashes"]) {
	await require(`./src/modules/${file}`)(client);
}
