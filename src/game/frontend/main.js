import { DiscordSDK } from "@discord/embedded-app-sdk";
import terminal from "virtual:terminal";
globalThis.console = terminal;

// Will eventually store the authenticated user's access_token
let auth;
let access_token;

console.log("Hey terminal! A message from the browser");
console.log(import.meta.env);
console.log(import.meta.env.VITE_DISCORD_CLIENT_ID);

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSdk().then(async () => {
	console.log("Discord SDK is authenticated");

	await appendUserAvatar();
});

async function appendUserAvatar() {
	const app = document.querySelector("#app");

	console.log("using " + access_token.access_token + " to fetch user info");

	// Fetch user information, including avatar
	let userInfo = await fetch(`https://discord.com/api/v10/users/@me`, {
		headers: {
			Authorization: `Bearer ${access_token.access_token}`,
			"Content-Type": "application/json",
		},
	});

	userInfo = await userInfo.json();

	console.log(userInfo); // Log user info object

	console.log(
		`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.webp?size=128`
	);

	// Check if user info was retrieved successfully
	if (userInfo) {
		// Create an img element to display the user's avatar
		const userImg = document.createElement("img");
		userImg.setAttribute(
			"src",
			// More info on image formatting here: https://discord.com/developers/docs/reference#image-formatting
			`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.webp?size=128`
		);
		userImg.setAttribute("width", "128px");
		userImg.setAttribute("height", "128px");
		userImg.setAttribute("style", "border-radius: 50%;");
		app.appendChild(userImg);
	}
}

async function setupDiscordSdk() {
	console.log(import.meta.env.VITE_DISCORD_CLIENT_ID);

	await discordSdk.ready();
	console.log("Discord SDK is ready");

	// Authorize with Discord Client
	const { code } = await discordSdk.commands.authorize({
		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
		response_type: "code",
		state: "",
		prompt: "none",
		scope: ["identify", "guilds"],
	});

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
	access_token = await response.json();

	// Authenticate with Discord client (using the access_token)
	auth = await discordSdk.commands.authenticate(access_token);

	if (auth == null) {
		throw new Error("Authenticate command failed");
	}
}
