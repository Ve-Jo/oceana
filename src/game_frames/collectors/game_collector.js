import { Collection } from "discord.js";
const ActiveCollectors = new Collection();

export default async ({ client, interaction }) => {
	if (ActiveCollectors.has(interaction.user.id)) {
		ActiveCollectors.get(interaction.user.id).stop();
		await interaction.editReply({
			content:
				"<a:loading3:1211006334313693255> Перезапускаю вашу недавно запущенную игру..",
			ephemeral: true,
		});
	}
	const collector = interaction.channel.createMessageComponentCollector({
		filter: (i) => i.user.id === interaction.user.id,
		idle: 60000,
	});
	ActiveCollectors.set(interaction.user.id, collector);

	collector.on("end", async () => {
		await interaction.editReply({
			components: [],
		});
		if (!ActiveCollectors.map((c, ids) => ids).includes(interaction.user.id)) {
			await client.browser.closePage(interaction.user.id);
		}
	});

	return collector;
};
