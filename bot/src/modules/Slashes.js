import { REST, Routes } from "discord.js";

export default (client) => {
	const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
	(async () => {
		try {
			await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
				body: client.commands.map((command) => command.data.toJSON()),
			});
		} catch (error) {
			console.error(error);
		}
	})();
};
