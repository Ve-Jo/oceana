import { DiscordSDK } from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

export default async function setupDiscordSdk() {
	try {
		await discordSdk.ready();

		const { code } = await discordSdk.commands.authorize({
			client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
			response_type: "code",
			state: "",
			prompt: "none",
			scope: ["identify", "guilds"],
		});

		console.log("fetching response...");

		// Retrieve an access_token from your activity's server
		const response = await fetch("/api/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				code,
			}),
		});
		const access_token = await response.json();

		return access_token;
	} catch (error) {
		console.error("Error during setupDiscordSdk:", error);
		throw error;
	}
}
