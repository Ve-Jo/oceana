const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Test command"),
	async execute(client, interaction) {
		console.log("start");
		console.time("playwright browser");
		await client.browser.startBrowser();
		console.timeEnd("playwright browser");
		console.time("playwright page");
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
