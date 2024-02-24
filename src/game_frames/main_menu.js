const ColorThief = require("colorthief");
const {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
} = require("discord.js");
const game = require("./game.js");

module.exports = async (client, interaction, collector) => {
	const rgbToHex = ([r, g, b]) =>
		[r, g, b]
			.map((x) => {
				const hex = x.toString(16);
				return hex.length === 1 ? "0" + hex : hex;
			})
			.join("");

	await client.browser.createPage(interaction.user.id, "./game/menu.html");

	let user_avatar_colors = await ColorThief.getColor(
		interaction.user.displayAvatarURL().replace("webp", "png")
	);

	console.log(user_avatar_colors);

	let user_avatar_colors_rgb = rgbToHex(await user_avatar_colors);

	await client.browser.changePage(interaction.user.id, {
		"start_btn.css.background-color": `#` + user_avatar_colors_rgb,
		playername: "@" + interaction.user.username,
		"playername.css.background-color": `#` + user_avatar_colors_rgb,
		"user_avatar.src":
			interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048",
		"discord_server_icon.src":
			"https://cdn.discordapp.com/icons/831633575601373274/bc7372fe90f8e81d9ef271852d082eca.png?size=2048",
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
		.setImage("attachment://screenshot.png")
		.setDescription(" ");

	let controls = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("game_start").setEmoji("▶").setStyle(1),
		new ButtonBuilder().setCustomId("game_settings").setEmoji("🔧").setStyle(2)
	);
	let controls2 = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setLabel("Наш дискорд сервер")
			.setStyle(5)
			.setURL("https://discord.gg/ABAb3Y5WcB")
	);

	await interaction.editReply({
		content: "",
		embeds: [test_embed],
		files: [attachment],
		components: [controls, controls2],
		ephemeral: true,
	});

	collector.on("collect", async (i) => {
		await i.deferUpdate();
		if (i.customId === "game_start") {
			await game({ client, interaction, collector });
		}
	});
};
