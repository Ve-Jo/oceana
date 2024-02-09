const { SlashCommandBuilder } = require("discord.js");
const { JSDOM } = require("jsdom");
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Test command"),
	async execute(client, interaction) {
		await interaction.deferReply();
		await client.browser.createPage(interaction.user.id, "test.html");
		await client.browser.changePage(interaction.user.id, {
			"user_avatar.src": await interaction.user.displayAvatarURL(),
			xp_text: Date.now(),
		});
		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			{ x: 9, y: 9, width: 600, height: 1200 },
			100
		);
		await client.browser.closePage(interaction.user.id);
		await interaction.editReply({ files: [buffer] });
	},
};
