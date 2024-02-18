// ебать мой хуй что я сделал, кринж, короче ты за меня сделаешь это говно а я попробую ему сделать красивый CSS

const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const os = require("os");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("uptime")
		.setDescription("Показывает uptime в виде красивой картинки"),
	async execute(client, interaction) {
		const uptime = (process.uptime() / 60).toFixed(2); // время работы в минутах
		const totalmem = (os.totalmem() / 1024 / 1024).toFixed(2); // общий объем памяти в МБ
		const freemem = (os.freemem() / 1024 / 1024).toFixed(2); // доступный объем памяти в МБ
		const loadavg = os.loadavg()[0].toFixed(2); // средняя нагрузка за последнюю минуту
		const cpuModel = os.cpus()[0].model; // модель CPU

		await interaction.deferReply();
		await client.browser.createPage(interaction.user.id, "uptime.html");

		await client.browser.changePage(interaction.user.id, {
			uptime: "Uptime: " + uptime + " minutes",
			total_memory: "Total memory: " + totalmem + " MB",
			free_memory: "Free memory: " + freemem + " MB",
			load_average: "Load average (1m): " + loadavg,
			cpu_model: "CPU model: " + cpuModel,
		});

		let buffer = await client.browser.screenshotPage(
			interaction.user.id,
			{ x: 9, y: 9, width: 600, height: 900 },
			100
		);

		const attachment = new AttachmentBuilder(buffer, {
			name: "screenshot.png",
		});

		/*await client.browser.closePage(interaction.user.id);*/
		await interaction.editReply({ files: [attachment] });
	},
};
