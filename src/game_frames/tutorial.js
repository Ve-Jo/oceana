import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import ColorThief from "../modules/ColorThief";

export default async (client, interaction, collector) => {
	await client.browser.createPage(interaction.user.id, "./game/tutorial.html");

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

	const controls = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("game_setboatname")
			.setStyle(ButtonStyle.Primary)
			.setLabel("Изменить имя корабля")
			.setEmoji("🚢")
	);

	async function update() {
		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			{ x: 8, y: 8, width: 500, height: 500 },
			100
		);

		const attachment = new AttachmentBuilder(buffer, {
			name: "screenshot.png",
		});

		await interaction.editReply({
			content: "",
			embeds: [test_embed],
			files: [attachment],
			components: [controls],
			ephemeral: true,
		});
	}
	update();

	collector.on("collect", async (i) => {
		if (i.customId === "game_setboatname") {
			let modal = new ModalBuilder()
				.setCustomId("game_setboat")
				.setTitle("Укажите текст");

			let text_input = new TextInputBuilder()
				.setCustomId("boat_name")
				.setLabel("Имя корабля")
				.setStyle(TextInputStyle.Short)
				.setMinLength(1)
				.setMaxLength(20);

			modal.addComponents(new ActionRowBuilder().addComponents(text_input));
			await i.showModal(modal);
			await i
				.awaitModalSubmit({
					time: 60000,
					filter: (i) => i.customId === "game_setboat",
				})
				.then(async (m) => {
					const boatname = m.fields.getTextInputValue("boat_name");
					await client.browser.changePage(interaction.user.id, {
						boat_text: boatname,
					});
					await m.deferUpdate();
					await update();
				});
		}
	});
};
