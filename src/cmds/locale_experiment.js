const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("locale")
		.setDescription("test locale"),
	async execute(client, interaction) {
		await interaction.reply({
			content: __("test"),
			ephemeral: true,
		});
	},
};
