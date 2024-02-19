const { Colr } = require("colr");
const ColorThief = require("colorthief");
const {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
} = require("discord.js");

module.exports = async (client, interaction) => {
	const rgbToHex = (r, g, b) =>
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("");

	await client.browser.createPage(interaction.user.id, "menu.html");

	let user_avatar_colors = await ColorThief.getColor(
		interaction.user.displayAvatarURL().replace("webp", "png")
	);
	let user_avatar_colors_rgb = rgbToHex(
		user_avatar_colors[0],
		user_avatar_colors[1],
		user_avatar_colors[2]
	);

	console.log(user_avatar_colors, user_avatar_colors_rgb);

	await client.browser.changePage(interaction.user.id, {
		"start_btn.css.background-color": `#` + user_avatar_colors_rgb,
		user_text: "Привет, " + interaction.user.username + "👋",
		"discord_server_icon.src":
			"https://cdn.discordapp.com/icons/831633575601373274/8b922357fdaeb7b6b7b3f7d05248dd22.png?size=2048",
	});

	let buffer = await client.browser.screenshotPage(
		interaction.user.id,
		{ x: 8, y: 8, width: 600, height: 500 },
		100
	);

	const attachment = new AttachmentBuilder(buffer, {
		name: "screenshot.png",
	});

	let test_embed = new EmbedBuilder()
		.setTitle("Test")
		.setImage("attachment://screenshot.png")
		.setDescription("Test description");

	await interaction.editReply({
		embeds: [test_embed],
		files: [attachment],
		ephemeral: true,
	});
};
