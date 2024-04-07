import {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
} from "discord.js";
import game from "./../game_frames/test.js";
/*import tutorial from "./first_boat.js";
import prettyMilliseconds from "pretty-ms";
import User from "./../models/UserModel.js";*/

import main_menu from "../htmls/game/canvas/main_menu";
import ColorThief from "../modules/ColorThief.js";

export default async (client, interaction, collector) => {
	let buffer = await main_menu(client, interaction);

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
		if (i.customId === "game_start") {
			await i.deferUpdate();
			await game(client, interaction, collector);
		}
		if (i.customId === "game_settings") {
			await i.deferUpdate();
			/*await client.browser.changePage(interaction.user.id, {
				"controls.css.visibility": "hidden",
				"settings.css.visibility": "none",
			});
			let buffer = await client.browser.screenshotPage(
				interaction.user.id,
				{ x: 8, y: 8, width: 600, height: 500 },
				100
			);

			const attachment = new AttachmentBuilder(buffer, {
				name: "screenshot.png",
			});
			await interaction.editReply({
				files: [attachment],
			});*/
		}
	});
};
