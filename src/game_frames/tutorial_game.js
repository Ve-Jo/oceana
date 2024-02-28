import { EmbedBuilder, AttachmentBuilder } from "discord.js";
import ColorThief from "../modules/ColorThief";

export default async (client, interaction, collector) => {
	await client.browser.createPage(
		interaction.user.id,
		"./game/tutorial_game.html"
	);

	await client.browser.changePage(interaction.user.id, {
		"user_avatar.src":
			interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048",
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

	let boatname;

	async function update() {
		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			{ x: 8, y: 8, width: 600, height: 500 },
			100
		);

		const attachment = new AttachmentBuilder(buffer, {
			name: "screenshot.png",
		});

		await interaction.editReply({
			content: "",
			embeds: [test_embed],
			files: [attachment],
			ephemeral: true,
		});
	}
	update();

	collector.on("collect", async (i) => {});
};
