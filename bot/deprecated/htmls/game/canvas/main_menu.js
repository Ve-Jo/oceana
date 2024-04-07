import canvas from "@napi-rs/canvas";
import ctx_extended from "./../../../modules/Canvas.js";

import prettyMilliseconds from "pretty-ms";
import User from "./../../../models/UserModel.js";

canvas.GlobalFonts.loadFontsFromDir("fonts");

export default async (client, interaction) => {
	let user = await User.findOne({ id: interaction.user.id });
	let user_level = user ? user.level : "0";

	let all_text = {
		hello: `Привет, ${interaction.user.username}!`,
		created_with_love: "Создано с любовью, @vejoy_",
		uptime: `${prettyMilliseconds(client.uptime)}`,
		bot_version: process.env.VISIBLE_VERSION,
		play: "Играть",
		level: `Уровень: ${user_level}`,
		settings: "Настройки",
		user_avatar_url:
			interaction.user.displayAvatarURL().replace("webp", "png") + "?size=2048",
		support_server_url:
			"https://cdn.discordapp.com/avatars/287275956744355841/74b466b6e166b3ee9f01e2c37ad9425b.png?size=2048",
		support_server: "Сервер поддержки",
		play_button_color: "rgb(210, 76, 76)",
	};

	/*let all_text = {
		hello: `Привет, {user}`,
		created_with_love: "Создано с любовью, @vejoy_",
		uptime: `2.4s 1h 25m 30m`,
		bot_version: "0.0.1",
		play: "Играть",
		level: `Уровень: {level}`,
		settings: "Настройки",
		user_avatar_url:
			"https://cdn.discordapp.com/avatars/287275956744355841/74b466b6e166b3ee9f01e2c37ad9425b.png?size=2048",
		support_server_url:
			"https://cdn.discordapp.com/avatars/287275956744355841/74b466b6e166b3ee9f01e2c37ad9425b.png?size=2048",
		support_server: "Сервер поддержки",
		play_button_color: "rgb(210, 76, 76)",
	};*/

	let all_emoji_used = ["🎣", "🌿", "👋", "⚙️", "▶️"];
	let all_images_used = [
		{
			image_name: "discord",
			image_url: "./src/htmls/sources/discord.png",
			localImage: true,
		},
		{
			image_name: "user_avatar-" + interaction.user.id,
			image_url: all_text["user_avatar_url"],
			localImage: false,
		},
		{
			image_name: "support_server_url",
			image_url: all_text["support_server_url"],
			localImage: false,
		},
	];
	let all_prerendered = {};

	let cnv = canvas.createCanvas(1200, 1000);
	let ctx = cnv.getContext("2d");

	console.time("loadLocalEmoji");
	await Promise.all(
		all_emoji_used.map(async (emoji) => {
			let emoji_img = await ctx_extended.loadLocalImage(
				"emojis",
				`${emoji}.png`
			);
			all_prerendered[emoji] = emoji_img;
		})
	);
	console.timeEnd("loadLocalEmoji");

	console.time("loadLocalImages");
	await Promise.all(
		all_images_used.map(async (image) => {
			let image_img = await ctx_extended.loadImage(
				image.image_name,
				image.image_url,
				image.localImage
			);
			all_prerendered[image.image_name] = image_img;
		})
	);
	console.timeEnd("loadLocalImages");

	let gradient = ctx.createLinearGradient(600, 0, 600, 1000);
	gradient.addColorStop(0, "rgb(98, 186, 244)");
	gradient.addColorStop(1, "rgb(44, 140, 208)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 1200, 1000);

	//LOGO FISH EMOJI
	ctx.save();
	ctx.translate(600, 600);
	ctx.rotate((Math.PI / 180) * 20);
	ctx.translate(-600, -600);
	ctx.drawImage(all_prerendered["🎣"], 620, 200, 100, 100);
	ctx.restore();

	//BACKGROUND
	ctx.save();
	ctx.translate(600, 600);
	ctx.rotate((Math.PI / 180) * 90);
	ctx.translate(-600, -600);

	ctx.filter = "blur(10px)";
	ctx.drawImage(all_prerendered["🌿"], -100, 850, 500, 500);
	ctx.filter = "none";
	ctx.restore();

	//LOGO
	ctx.font = "600 200px Jost";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Oceana", 600, 440);

	//UPTIME
	ctx.font = "900 40px Jost";
	ctx_extended.ez_rectangle(
		ctx,
		275,
		475,
		ctx.measureText(all_text["uptime"]).width + 70,
		60,
		25,
		"rgba(255, 255, 255, 1)"
	);

	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	ctx.fillText(all_text["uptime"], 320, 520);
	ctx_extended.ez_rectangle(ctx, 245, 455, 60, 60, 35, "rgb(120, 177, 89)");

	//BOT VERSION
	ctx_extended.ez_rectangle(
		ctx,
		800,
		475,
		135,
		60,
		25,
		"rgba(255, 255, 255, 1)"
	);
	ctx.font = "900 40px Jost";
	ctx.fillStyle = "black";
	ctx.fillText(all_text["bot_version"], 821, 520);

	//DISCORD ICON IMAGE
	/*let discord_image =
		all_prerendered[fs.readFileSync("./src/htmls/sources/discord.png")];*/
	let discord_image = await ctx_extended.loadImage(
		"sources",
		"./src/htmls/sources/discord.png",
		true
	);
	ctx.drawImage(discord_image, 980, 70, 200, 110);

	//👋 HELLO, {NAME} TEXT

	await ctx_extended.drawAvatar(
		ctx,
		all_prerendered["user_avatar-" + interaction.user.id],
		35,
		35,
		165,
		0.3
	);
	ctx.drawImage(all_prerendered["👋"], 220, 70, 80, 80);
	ctx.font = "600 60px Jost";
	ctx.textAlign = "left";
	ctx.fillStyle = "white";
	ctx.fillText(all_text["hello"], 320, 136);

	//CREATED WITH LOVE TEXT
	ctx.font = "600 40px Jost";
	ctx.fillStyle = "rgb(255, 255, 255, 0.3)";
	ctx.fillText(all_text["created_with_love"], 50, 940);

	//SETTINGS BUTTON
	ctx_extended.ez_rectangle(ctx, 25, 730, 375, 150, 55, "rgb(103, 166, 244)");
	ctx_extended.ez_rectangle(ctx, 255, 737, 135, 135, 50, "rgb(66, 154, 255)");
	ctx.drawImage(all_prerendered["⚙️"], 270, 750, 110, 110);
	ctx.textAlign = "center";
	ctx.filter = "none";
	ctx.fillStyle = "white";
	await ctx_extended.autoTextFont(ctx, all_text["settings"], 190, "Jost");
	ctx.fillText(all_text["settings"], 140, 820);

	//SERVER SUPPORT
	ctx_extended.ez_rectangle(ctx, 850, 730, 320, 150, 50, "rgb(103, 166, 244)");
	await ctx_extended.autoTextFont(ctx, all_text["support_server"], 270, "Jost");
	ctx.textAlign = "left";
	ctx_extended.fillLongText(ctx, all_text["support_server"], 990, 790, 270, 50);
	await ctx_extended.drawAvatar(
		ctx,
		all_prerendered["support_server_url"],
		875,
		755,
		100,
		0.3
	);

	//PLAY BUTTON
	ctx_extended.ez_rectangle(
		ctx,
		430,
		700,
		390,
		180,
		50,
		all_text["play_button_color"]
	);
	ctx.drawImage(all_prerendered["▶️"], 390, 650, 145, 145);
	ctx.fillStyle = "white";
	await ctx_extended.autoTextFont(ctx, all_text["play"], 240, "Jost", true);
	ctx.fillText(all_text["play"], 560, 780);
	ctx.textAlign = "center";
	await ctx_extended.autoTextFont(ctx, all_text["level"], 300, "Jost");
	ctx.fillText(all_text["level"], 625, 850);

	return cnv.toBuffer("image/jpeg");
};
