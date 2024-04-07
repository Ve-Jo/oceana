import { SlashCommandBuilder, Collection } from "discord.js";
import main_menu from "../game_frames/main_menu.js";
import game_collector from "../game_frames/collectors/game_collector.js";

export default {
	data: new SlashCommandBuilder().setName("game").setDescription("Запуск игры"),
	async execute({ client, interaction }) {
		await interaction.deferReply();
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
