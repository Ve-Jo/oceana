import Canvas from "@napi-rs/canvas";
import * as emojis from "./../../../modules/Canvas.js";

import fs from "fs";

Canvas.GlobalFonts.loadFontsFromDir("fonts");

export default async () => {
	let all_text = {
		hello: "Привет, {name}",
		created_with_love: "Создано с любовью, @vejoy_",
		uptime: "10h 20m 30s",
		bot_version: "0.0.1",
	};

	let canvas = Canvas.createCanvas(1200, 1000);
	let ctx = canvas.getContext("2d");

	let gradient = ctx.createLinearGradient(0, 0, 1200, 1000);
	gradient.addColorStop(0, "rgb(98, 186, 244)");
	gradient.addColorStop(1, "rgb(44, 140, 208)");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 1200, 1000);

	//LOGO FISH EMOJI
	await emojis.loadLocalImage("emojis", "🎣.png").then(async (img) => {
		ctx.save();
		ctx.translate(600, 600);
		ctx.rotate((Math.PI / 180) * 20);
		ctx.translate(-600, -600);
		ctx.drawImage(img, 620, 200, 100, 100);
		ctx.restore();
	});

	//LOGO
	ctx.font = "600 200px Jost";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText("Oceana", 600, 440);

	//UPTIME
	emojis.ez_rectangle(ctx, 275, 475, 300, 60, 25, "rgba(255, 255, 255, 1)");
	ctx.font = "900 40px Jost";
	ctx.fillStyle = "black";
	ctx.textAlign = "right";
	ctx.fillText(all_text["uptime"], 550, 520);
	emojis.ez_rectangle(ctx, 245, 455, 60, 60, 35, "rgba(0, 180, 0, 1)");

	//BOT VERSION
	emojis.ez_rectangle(ctx, 812, 475, 120, 60, 25, "rgba(255, 255, 255, 1)");
	ctx.font = "900 40px Jost";
	ctx.fillStyle = "black";
	ctx.fillText(all_text["bot_version"], 920, 520);

	//DISCORD ICON IMAGE
	let discord_image = await Canvas.loadImage(
		fs.readFileSync("./src/htmls/sources/discord.png")
	);
	ctx.drawImage(discord_image, 960, 70, 200, 110);

	//👋 HELLO, {NAME} TEXT
	await emojis.loadLocalImage("emojis", "👋.png").then(async (img) => {
		ctx.drawImage(img, 150, 70, 80, 80);
	});
	ctx.font = "600 60px Jost";
	ctx.textAlign = "left";
	ctx.fillStyle = "white";
	ctx.fillText(all_text["hello"], 250, 136);

	//CREATED WITH LOVE TEXT
	ctx.font = "600 40px Jost";
	ctx.fillStyle = "rgb(255, 255, 255, 0.3)";
	ctx.fillText(all_text["created_with_love"], 50, 940);

	return canvas.toBuffer("image/png");
};
