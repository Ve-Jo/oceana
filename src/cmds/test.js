const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Test command"),
	async execute(client, interaction) {
		return interaction.reply({
			content: "Woohoo!",
		});
	},
};
