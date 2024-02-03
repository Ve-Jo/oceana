const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = function (client) {
	client.commands = new Collection();

	const commandsPath = path.resolve(import.meta.dir, "../", "cmds");

	const commandFiles = fs
		.readdirSync("./src/cmds")
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = require(path.join(commandsPath, file));
		console.log(`COMMAND ${command.data.name} is loaded`);
		command.data.dm_permission = false;
		client.commands.set(command.data.name, command);
	}
};
