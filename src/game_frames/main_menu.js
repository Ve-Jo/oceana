import {
	EmbedBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ActionRowBuilder,
} from "discord.js";
/*import game from "./game.js";*/
import tutorial from "./first_boat.js";
import ColorThief from "../modules/ColorThief.js";
import prettyMilliseconds from "pretty-ms";
import User from "./../models/UserModel";

export default async (client, interaction, collector) => {
	await client.browser.createPage(interaction.user.id, "./game/main_menu.html");

	let user_avatar_colors_rgb = await ColorThief.closer_color(
		interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048"
	);

	console.log(await user_avatar_colors_rgb);

	let user = await User.findOne({ id: interaction.user.id });
	console.log(user);
	let user_level = user ? user.level : "0";
	await client.browser.changePage(interaction.user.id, {
		"start_btn.css.background-color": `#` + user_avatar_colors_rgb,
		playername: "@" + interaction.user.username,
		"playername.css.background-color": `#` + user_avatar_colors_rgb,
		"user_avatar.src":
			interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048",
		"discord_server_icon.src":
			"https://cdn.discordapp.com/icons/831633575601373274/bc7372fe90f8e81d9ef271852d082eca.png?size=2048",
		uptimed: prettyMilliseconds(client.uptime),
		version: process.env.VISIBLE_VERSION,
		level_text: `Уровень: ${user_level}`,

		/*support_booster_emoji: client.guilds.cache
			.get(process.env.SUPPORT_SERVER_ID)
			.users.cache.get(`${interaction.user.id}`)
			? "✅"
			: "❌", DOESNT WORK, NEED AN INTENT*/
	});

	await client.browser.alignLocalization(
		interaction.user.id,
		{
			user_text: interaction.user.username,
			support_booster: "10%",
			level_text: user_level,
			creator_text: "@vejoy",
		},
		interaction.locale
	);

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
			if (await User.exists({ id: interaction.user.id })) {
				/*await game(client, interaction, collector);*/
			} else {
				await tutorial(client, interaction, collector);
			}
		}
		if (i.customId === "game_settings") {
			await i.deferUpdate();
			await client.browser.changePage(interaction.user.id, {
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
			});
		}
	});
};
