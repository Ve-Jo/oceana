const { SlashCommandBuilder, Collection } = require("discord.js");
const main_menu = require("../game_frames/main_menu.js");
const game_collector = require("../game_frames/collectors/game_collector.js");
module.exports = {
	data: new SlashCommandBuilder().setName("game").setDescription("Запуск игры"),
	async execute({ client, interaction }) {
		await interaction.deferReply();
		if (!client.browser.status()) {
			await interaction.editReply({
				content:
					"<a:loading:1211004913115463792> Подождите.. Запускаем браузер для игры. Это займет чуть-чуть больше времени.",
			});
		}
		await interaction.editReply({
			content: "<a:loading2:1211005141222695052> Запускаю главное меню..",
			ephemeral: true,
		});
		await main_menu(
			client,
			interaction,
			await game_collector({ client, interaction })
		);
	},
};
