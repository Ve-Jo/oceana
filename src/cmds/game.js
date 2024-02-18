const {
	SlashCommandBuilder,
	AttachmentBuilder,
	EmbedBuilder,
} = require("discord.js");
const User = require("../models/UserModel");

module.exports = {
	data: new SlashCommandBuilder().setName("game").setDescription("Запуск игры"),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: true });

		if (!(await User.findOne({ id: interaction.user.id }))) {
			return await interaction.editReply({
				content:
					"Вы не зарегистрированы в базе данных. Запустите команду `/register`.",
				ephemeral: true,
			});
		}

		await client.browser.createPage(interaction.user.id, "game.html");
		await client.browser.changePage(interaction.user.id, {
			"user_avatar.src": interaction.user.displayAvatarURL() + "?size=2048",
			xp_text: Date.now(),
		});

		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			{ x: 9, y: 9, width: 600, height: 900 },
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
	},
};
