import fs from "fs";
import path from "path";
import { Collection } from "discord.js";

export default async function (client) {
	client.events = new Collection();

	const eventsPath = path.resolve(import.meta.dir, "../", "events");

	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(".js"));

	for (const file of eventFiles) {
		const event = await import(path.join(eventsPath, file));
		console.log(`EVENT ${event.default.name} is loaded`);
		client.events.set(event.default.name, event.default);
	}

	client.events.forEach((event) => {
		if (event.once) {
			client.once(event.name, (...args) => event.run(client, ...args));
		} else {
			client.on(event.name, (...args) => event.run(client, ...args));
		}
	});
}
