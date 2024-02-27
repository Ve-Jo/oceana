import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import ColorThief from "../modules/ColorThief";

export default async (client, interaction, collector) => {
	await client.browser.createPage(interaction.user.id, "./game/tutorial.html");

	await client.browser.changePage(interaction.user.id, {
		"user_avatar.src":
			interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048",
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
		.setDescription(" ")
		.setColor(
			"#" +
				(await ColorThief.closer_color(
					client.user.displayAvatarURL().replace("webp", "png")
				))
		);

	const controls = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("game_setboatname")
			.setStyle(ButtonStyle.Primary)
			.setLabel("Изменить имя корабля")
			.setEmoji("🚢")
	);

	await interaction.editReply({
		content: "",
		embeds: [test_embed],
		files: [attachment],
		components: [controls],
		ephemeral: true,
	});
};
