import { DiscordSDK } from "@discord/embedded-app-sdk";
import { useColor } from "color-thief-react";

// Will eventually store the authenticated user's access_token
let auth;
let access_token;

const rgbToHex = ([r, g, b]) => {
	console.log([r, g, b]);
	[r, g, b]
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		})
		.join("");
};

console.log("Hey terminal! A message from the browser");

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

try {
	await setupDiscordSdk();

	if (access_token) {
		await appendUserAvatar();
	}
} catch (error) {
	console.log(error);
}

async function appendUserAvatar() {
	let userInfo = await fetch(`https://discord.com/api/v10/users/@me`, {
		headers: {
			Authorization: `Bearer ${access_token.access_token}`,
			"Content-Type": "application/json",
		},
	});
	userInfo = await userInfo.json();

	let user_avatar_link = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.webp?size=128`;

	if (userInfo) {
		const userImg = document.querySelector("#useravatar");
		userImg.setAttribute("src", user_avatar_link);

		const hello_text = document.querySelector("#hello");
		hello_text.innerHTML = `👋 Привет, ${userInfo.username}!`;
	}
}

async function setupDiscordSdk() {
	console.log(import.meta.env.VITE_DISCORD_CLIENT_ID);

	await discordSdk.ready();
	console.log("Discord SDK is ready");
	console.log("Sending authorizing...");

	// Authorize with Discord Client
	const { code } = await discordSdk.commands.authorize({
		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
		response_type: "code",
		state: "",
		prompt: "none",
		scope: ["identify", "guilds"],
	});

	console.log("fetching responce...");

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

	console.log("access_token", access_token);

	// Authenticate with Discord client (using the access_token)
	auth = await discordSdk.commands.authenticate(access_token);

	if (auth == null) {
		throw new Error("Authenticate command failed");
	}
}
