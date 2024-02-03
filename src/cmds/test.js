const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Test command"),
	async execute(client, interaction) {
		await client.browser.createPage(interaction.user.id);
		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			"<h1>Hello, World!</h1>"
		);
		await client.browser.closePage(interaction.user.id);
		console.timeEnd("playwright page");
		await interaction.reply({ files: [buffer] });
	},
};
