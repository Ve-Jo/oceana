import Canvas from "@napi-rs/canvas";
import { noise } from "@chriscourses/perlin-noise";
import ctx_extended from "./../../../modules/Canvas.js";

import { createNoise3D } from "simplex-noise";
import alea from "alea";

import User from "./../../../models/UserModel";

const noise3D = createNoise3D(alea("1"));

export default async (user) => {
	/*let user = await User.findOne({ id: "287275956744355841" });*/

	let all_text = {
		user_avatar_url:
			"https://cdn.discordapp.com/avatars/287275956744355841/74b466b6e166b3ee9f01e2c37ad9425b.png?size=2048",
	};
	let all_emoji_used = ["🗺️"];
	let all_images_used = [
		{
			image_name: "boat",
			image_url: "./src/htmls/sources/icons/boat.png",
			localImage: true,
		},
		{
			image_name: "fish",
			image_url: "./src/htmls/sources/icons/fish.png",
			localImage: true,
		},
		{
			image_name: "user_avatar-" + "test",
			image_url: all_text["user_avatar_url"],
			localImage: false,
		},
	];
	let all_prerendered = {};

	let canvas = Canvas.createCanvas(800, 1400);
	let ctx = canvas.getContext("2d");

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

	ctx.imageSmoothingEnabled = false;

	let pixelSize = 5;
	let scale = 0.002;
	let depthMap = [];

	/*user.boat.rotation = 0;
	user.x = 0;
	user.y = 0;*/

	for (let y = 0; y < canvas.height; y += pixelSize) {
		depthMap[y] = [];
		for (let x = 0; x < canvas.width; x += pixelSize) {
			const noiseValue = noise3D(
				(x - user.x) * scale,
				(y - user.y) * scale,
				10
			);
			depthMap[y][x] = noiseValue;
		}
	}

	for (let y = 0; y < canvas.height; y += pixelSize) {
		for (let x = 0; x < canvas.width; x += pixelSize) {
			const depth = depthMap[y][x];
			const color = `rgb(0, ${Math.floor(25 - 150 * depth)}, 255)`;

			ctx.fillStyle = color;
			ctx.fillRect(x, y, pixelSize, pixelSize);
		}
	}

	let image = await Canvas.loadImage(all_prerendered["boat"]);
	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate(user.boat.rotation * (Math.PI / 180));
	ctx.drawImage(image, -50, -100, 100, 200);

	if (user.boat.rotation >= 60 && user.boat.rotation < 130) {
		ctx.translate(175, 175);
		ctx.rotate((Math.PI / 180) * -90);
	}
	if (user.boat.rotation >= 130 && user.boat.rotation < 220) {
		ctx.translate(0, 10);
		ctx.rotate((Math.PI / 180) * -180);
	}
	if (user.boat.rotation >= 220 && user.boat.rotation < 320) {
		ctx.translate(-175, -175);
		ctx.rotate((Math.PI / 180) * 90);
	}
	if (user.boat.rotation >= 320) {
		ctx.translate(0, 0);
		ctx.rotate((Math.PI / 180) * 360);
	}
	ctx_extended.ez_rectangle(ctx, 75, -100, 200, 75, 30, "green");
	ctx.drawImage(all_prerendered["🗺️"], 90, -100, 100, 100);

	ctx.restore();

	for (let fish of user.world.staff) {
		let fishImage = await Canvas.loadImage(all_prerendered["fish"]);

		const fishOffsetX = fish.x + user.x;
		const fishOffsetY = fish.y + user.y;

		if (
			fishOffsetX >= 0 &&
			fishOffsetX <= canvas.width &&
			fishOffsetY >= 0 &&
			fishOffsetY <= canvas.height
		) {
			/*ctx.drawImage(fishImage, fishOffsetX, fishOffsetY, 40, 35);*/
		}
	}

	ctx.imageSmoothingEnabled = true;

	ctx_extended.drawAvatar(
		ctx,
		all_prerendered["user_avatar-test"],
		50,
		50,
		160,
		0.3
	);

	return canvas.toBuffer("image/png");
};
