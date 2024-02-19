const { AttachmentBuilder } = require("discord.js");

module.exports = async (client, interaction) => {
	await client.browser.createPage(interaction.user.id, "game.html");

	let buffer = await client.browser.screenshotPage(
		interaction.user.id,
		{ x: 8, y: 8, width: 600, height: 900 },
		100
	);

	const attachment = new AttachmentBuilder(buffer, {
		name: "screenshot.png",
	});

	await interaction.editReply({
		embeds: [],
		files: [attachment],
		components: [],
		ephemeral: true,
	});
};
