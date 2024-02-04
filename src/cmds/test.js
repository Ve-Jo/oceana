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
			fs.readFileSync("src/htmls/test.html", "utf8")
		);
		await client.browser.closePage(interaction.user.id);
		console.timeEnd("playwright page");
		await interaction.reply({ files: [buffer] });
	},
};
