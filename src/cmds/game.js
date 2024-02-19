const { SlashCommandBuilder, Collection } = require("discord.js");

const main_menu = require("./../game_frames/main_menu.js");
const game = require("./../game_frames/game.js");

const ActiveCollectors = new Collection();

module.exports = {
	data: new SlashCommandBuilder().setName("game").setDescription("Запуск игры"),
	async execute(client, interaction) {
		await interaction.deferReply({ ephemeral: true });
		await main_menu(client, interaction);
		if (ActiveCollectors.has(interaction.user.id)) {
			ActiveCollectors.get(interaction.user.id).stop();
			console.log("stopped recent collector from that user");
		}
		const collector = interaction.channel.createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id,
			time: 10000,
		});
		ActiveCollectors.set(interaction.user.id, collector);
		collector.on("collect", async (i) => {
			await i.deferUpdate();
			if (i.customId === "game_start") {
				await game(client, interaction);
			}
		});
		collector.on("end", async (collected) => {
			await interaction.editReply({
				components: [],
			});
			console.log("end");
			await client.browser.closePage(interaction.user.id);
		});
	},
};
