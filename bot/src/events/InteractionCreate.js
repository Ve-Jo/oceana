import { Events } from "discord.js";

let latest_lang;

export default {
	name: Events.InteractionCreate,
	run: async (client, interaction) => {
		let command;

		const interactionTypes = [
			"isCommand",
			"isButton",
			"isStringSelectMenu",
			"isAutocomplete",
		];
		for (let i = 0; i < interactionTypes.length; i++) {
			const type = interactionTypes[i];
			if (interaction[type]()) {
				if (latest_lang !== interaction.locale) {
					client.i18n.setLocale(interaction.locale);
					latest_lang = interaction.locale;
					console.log("Locale is set to " + interaction.locale);
				}
				if (type === "isCommand") {
					command = client.commands.get(interaction.commandName);
					if (!command) break;
					try {
						await command.execute({ client, interaction });
					} catch (error) {
						console.error(error);
					}
				}
				break;
			}
		}
	},
};
