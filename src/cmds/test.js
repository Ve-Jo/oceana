const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Test command"),
	async execute(client, interaction) {
		await client.browser.createPage(interaction.user.id);
		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			fs.readFileSync("src/htmls/test.html", "utf8"),
			{ x: 0, y: 0, width: 600, height: 1200 },
			50
		);
		await client.browser.closePage(interaction.user.id);
		await interaction.reply({ files: [buffer] });
	},
};
