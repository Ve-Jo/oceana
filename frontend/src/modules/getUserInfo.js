export default async function (access_token) {
	let userInfo = await fetch(`https://discord.com/api/v10/users/@me`, {
		headers: {
			Authorization: `Bearer ${access_token.access_token}`,
			"Content-Type": "application/json",
		},
	});
	userInfo = await userInfo.json();

	userInfo.link = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.webp?size=128`;

	return userInfo;
}
