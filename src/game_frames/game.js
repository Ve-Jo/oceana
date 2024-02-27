import { AttachmentBuilder } from "discord.js";

export default async ({ client, interaction, collector }) => {
	console.log(collector);

	/*await client.browser.createPage(interaction.user.id, "./game/game.html");

	await client.browser.changePage(interaction.user.id, {
		xp_text: "XP: 0!",
		"user_avatar.src":
			interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048",
	});

	let buffer = await client.browser.screenshotPage(
		interaction.user.id,
		{ x: 8, y: 8, width: 600, height: 900 },
		100
	);

	const attachment = new AttachmentBuilder(buffer, {
		name: "screenshot.png",
	});

	await interaction.editReply({
		embeds: [],
		files: [attachment],
		components: [],
		ephemeral: true,
	});*/
};
