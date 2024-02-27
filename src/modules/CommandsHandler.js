import { Collection } from "discord.js";
import fs from "fs";
import path from "path";

import slashes from "./Slashes";

export default async function (client) {
	client.commands = new Collection();

	const commandsPath = path.resolve(import.meta.dir, "../", "cmds");

	const commandFiles = fs
		.readdirSync("./src/cmds")
		.filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const command = await import(commandsPath + "/" + file);
		console.log(`COMMAND ${command.default.data.name} is loaded`);
		command.default.data.dm_permission = false;
		client.commands.set(command.default.data.name, command.default);
	}

	slashes(client);
}
