import { DiscordSDK } from "@discord/embedded-app-sdk";

let auth;
let initializationPromise;

export default function setupDiscordSdk() {
	if (!initializationPromise) {
		initializationPromise = new Promise(async (resolve, reject) => {
			try {
				let discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

				await discordSdk.ready();
				console.log("Discord SDK is ready");

				const { code } = await discordSdk.commands.authorize({
					client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
					response_type: "code",
					state: "",
					prompt: "none",
					scope: ["identify", "guilds"],
				});

				const response = await fetch("/api/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						code,
					}),
				});
				const { access_token } = await response.json();

				auth = await discordSdk.commands.authenticate({
					access_token,
				});

				if (auth == null) {
					throw new Error("Authenticate command failed");
				}

				console.log(auth);

				resolve(auth);
			} catch (error) {
				console.error("Error during setupDiscordSdk:", error);
				reject(error);
			}
		});
	}

	return initializationPromise;
}
