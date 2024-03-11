import Canvas from "@napi-rs/canvas";
import ctx_extended from "./../../../modules/Canvas.js";

import { createNoise3D, createNoise2D } from "simplex-noise";
import alea from "alea";

import User from "./../../../models/UserModel";

Canvas.GlobalFonts.loadFontsFromDir("fonts");

const depth3D = createNoise2D(alea("1"));
const locationDepth3D = createNoise2D(alea("2"));

export default async (/*user*/) => {
	let user = await User.findOneAndUpdate(
		{ id: "287275956744355841" },
		{ upsert: true, new: true }
	);

	user.boat.rotation = 0;
	user.x = 0;
	user.y = 200;

	let interaction = null;

	let all_text = {
		user_avatar_url:
			typeof interaction == "object"
				? "https://cdn.discordapp.com/avatars/287275956744355841/74b466b6e166b3ee9f01e2c37ad9425b.png?size=2048"
				: interaction.user.displayAvatarURL(),
	};
	let all_emoji_used = ["🗺️", "👋", "💵", "💎", "🌠"];
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

	//FILTER
	function applyFilterBasedOnNoise() {
		const noiseValue = locationDepth3D(user.x * 0.00005, user.y * 0.00002);

		console.log(noiseValue);

		ctx.filter = `hue-rotate(${noiseValue * 360}deg); contrast(${
			noiseValue * 2
		}%)`;
	}
	applyFilterBasedOnNoise();

	//WATER WITH DEPTH

	ctx.fillStyle = "rgb(0, 0, 255)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	let pixelSize = 4;
	let scale = 0.002;

	const threshold = 0.001;
	const colorBucketSize = 0.01;
	const mergeDistance = pixelSize * 2;

	let batches = new Map();
	let currentColor = null;

	for (let y = 0; y < canvas.height; y += pixelSize) {
		for (let x = 0; x < canvas.width; x += pixelSize) {
			const noiseValue = depth3D((x - user.x) * scale, (y - user.y) * scale);

			if (noiseValue < threshold) {
				const colorBucket =
					Math.floor(noiseValue / colorBucketSize) * colorBucketSize;

				if (currentColor !== colorBucket) {
					processBatch(currentColor, batches);
					currentColor = colorBucket;
				}

				let collided = false;
				for (let [color, batch] of batches) {
					if (color - 0.1 < currentColor) {
						for (const item of batch) {
							if (
								Math.abs(item.x - x) < mergeDistance &&
								Math.abs(item.y - y) < mergeDistance
							) {
								item.width += pixelSize;
								item.height += pixelSize;
								collided = true;
								break;
							}
						}
					}
					if (collided) break;
				}

				if (!collided) {
					if (!batches.has(currentColor)) {
						batches.set(currentColor, []);
					}
					batches
						.get(currentColor)
						.push({ x, y, width: pixelSize, height: pixelSize });
				}
			}
		}
	}
	ctx.filter = "none";
	processBatch(currentColor, batches);
	function processBatch(color, batches) {
		if (!color || !batches.has(color)) return;
		ctx.fillStyle = `rgb(0, ${Math.floor(-140 * color)}, 255)`;
		ctx.beginPath();

		const batch = batches.get(color);
		for (const item of batch) {
			ctx.fillRect(item.x, item.y, item.width, item.height);
		}

		ctx.closePath();
		batches.delete(color);
	}

	let ui_elements = [
		{
			type: "graph",
			emoji: "🌠",
			current_value: user.xp.current < 10 ? 10 : user.xp.current,
			max_value: user.xp.max,
			text: "LVL 0 (0/100)",
		},
		{
			emoji: "🗺️",
			text: "Тест",
		},
		{
			emoji: "🗺️",
			text: "Тест",
		},
	];

	//BOAT WITH UI
	let image = await Canvas.loadImage(all_prerendered["boat"]);
	ctx.save();
	ctx.filter = "contrast(1.5) brightness(1.5)";
	ctx.globalCompositeOperation = "luminosity";
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate(user.boat.rotation * (Math.PI / 180));
	ctx.drawImage(image, -50, -100, 100, 200);

	/*let rotation = Math.abs(user.boat.rotation % 360);
	if (user.boat.rotation < 0) {
		ctx.rotate((Math.PI / 180) * 180);
		if (user.boat.rotation <= -60 && user.boat.rotation > -130) {
			ctx.scale(-1, -1);
		}
		if (user.boat.rotation <= -130 && user.boat.rotation > -220) {
			ctx.scale(1, 1);
		}
		if (user.boat.rotation <= -220 && user.boat.rotation > -320) {
			ctx.scale(-1, -1);
		}
		ctx.scale(-1, -1);
	}*/

	if (user.boat.speed.current > 0) {
		let number_decreaser = user.boat.speed.max / 5;
		let speed_difference_normalized_inverted_scaled = Math.max(
			1,
			Math.floor(
				5 -
					(user.boat.speed.max / number_decreaser -
						user.boat.speed.current / number_decreaser)
			)
		);
		console.log(user.boat.speed.current / number_decreaser);
		console.log(user.boat.speed.max / number_decreaser);
		let speed_image = await ctx_extended.loadLocalImage(
			"./src/htmls/sources/icons/speed",
			`move-arrow-${speed_difference_normalized_inverted_scaled}.png`
		);
		ctx.drawImage(speed_image, -100, -265, 200, 200);
	}

	ctx.globalCompositeOperation = "source-over";
	ctx.filter = "none";

	/*let ui_bottom_offset = 0;
	let ui_top_offset = 0;

	if (ui_elements.length > 4) {
		ui_bottom_offset = (ui_elements.length - 4) * 25;
		if (ui_elements.length % 2 !== 0) {
			ui_top_offset = 50;
		}
	}*/

	if (rotation >= 60 && rotation < 130) {
		ctx.translate(175, 175);
		ctx.rotate((Math.PI / 180) * -90);
	} else if (rotation >= 130 && rotation < 220) {
		ctx.translate(0, 10);
		ctx.rotate((Math.PI / 180) * -180);
	} else if (rotation >= 220 && rotation < 320) {
		ctx.translate(150, -175);
		ctx.rotate((Math.PI / 180) * 90);
	} else if (rotation >= 320) {
		ctx.translate(0, 0);
		ctx.rotate((Math.PI / 180) * 360);
	}

	ctx.font = "900 20px Jost";

	function display_elements(ui_elements) {
		let halfLength = Math.round(ui_elements.length / 2);
		let i_top = 0;
		let i2_top = 0;
		let i3_top = 0;
		let visible_i = 0;

		let globalOffsetHalf = 0;
		for (let i = 0; i < ui_elements.length; i++) {
			const ui_element = ui_elements[i];
			let offsetY = -100 + visible_i * 100;
			let offsetX = 0;
			let globalOffsetY = 0;
			let globalOffsetX = 0;
			let globalOffsetY2 = 0;
			let emojiOffsetY = 0;
			let emojiOffsetX = 0;
			let emojiSize = 60;
			let textOffsetY = 0;
			let textOffsetX = 0;

			if (ui_element.type == "graph") {
				offsetX -= 165;
				offsetY += 225 + i3_top * 70;
				emojiOffsetY = -40;
				emojiOffsetX = -30;
				ctx.textAlign = "center";
				emojiSize = 25;
				textOffsetX = 25;
				textOffsetY = -2;
				if (rotation >= 60 && rotation < 130) {
					globalOffsetY2 = -200;
					globalOffsetX = 150;
					offsetX += 10;
				} else {
					visible_i--;
					if (rotation >= 130 && rotation < 220) {
						offsetY -= 215;
						console.log(`I3_TOP`, i3_top);
						globalOffsetY2 = -75 - i3_top * 140;
					} else if (rotation >= 220 && rotation < 320) {
						offsetY += 100;
						offsetX += 165;
						globalOffsetHalf += 60;
					}
					i3_top++;
				}
			} else {
				ctx.textAlign = "left";
				if (rotation >= 220 && rotation < 320) {
					globalOffsetY2 = 100 + -(i2_top * 200);
					i2_top++;
				}

				if (i - i3_top >= halfLength - Math.floor(i3_top / 2) && i > 1) {
					if (rotation >= 60 && rotation < 130) {
						offsetY = -325 - i_top * 100;
					} else if (rotation >= 130 && rotation < 220) {
						offsetY = -100 + i_top * 100;
						offsetX = -350;
					} else if (rotation >= 220 && rotation < 320) {
						offsetY = 225 + globalOffsetHalf + i_top * 100;
					} else {
						offsetY = -100 + i_top * 120;
						offsetX = -350;
					}
					i_top++;
					globalOffsetY2 = 0;
				}
			}

			if (ui_element.type !== "graph") {
				ctx_extended.ez_rectangle(
					ctx,
					globalOffsetX + offsetX + 75,
					globalOffsetY2 + globalOffsetY + offsetY,
					ui_element.width || 200,
					ui_element.height || 75,
					25,
					"rgba(255, 255, 255, 0.4)"
				);
			}
			ctx.drawImage(
				all_prerendered[ui_element.emoji],
				globalOffsetX + offsetX + 85 + emojiOffsetX,
				globalOffsetY2 + globalOffsetY + offsetY + 8 + emojiOffsetY,
				emojiSize,
				emojiSize
			);
			ctx.fillStyle = "white";
			if (ui_element.text) {
				ctx_extended.fillLongText(
					ctx,
					ui_element.text,
					globalOffsetX + offsetX + 150 + textOffsetX,
					globalOffsetY2 + globalOffsetY + offsetY + 25 + textOffsetY,
					ui_element.width || 150,
					20
				);
			}
			if (ui_element.type == "graph") {
				ctx_extended.ez_rectangle(
					ctx,
					globalOffsetX + offsetX + 50,
					globalOffsetY2 + globalOffsetY + offsetY,
					250,
					30,
					10,
					"rgba(255, 255, 255, 0.2)"
				);
				ctx_extended.ez_rectangle(
					ctx,
					globalOffsetX + offsetX + 50,
					globalOffsetY2 + globalOffsetY + offsetY,
					(ui_element.current_value / ui_element.max_value) * 300,
					30,
					10,
					"rgb(50, 255, 220, 0.3)"
				);
			}
			visible_i++;
		}
	}

	display_elements(ui_elements);

	ctx.restore();

	//FISHES
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

	//UI
	let avatar_size = 150;
	let avatar_x = 50;

	let main_ui = [
		{
			emoji: "💵",
			value: user.money.toFixed(1),
		},
		{
			emoji: "💎",
			value: user.diamonds.toFixed(2),
		},
	];

	avatar_size = 150 - main_ui.length * 5;

	let avatar_offset_x = avatar_x + avatar_size + 25;

	ctx.fillStyle = "white";
	ctx.font = "900 45px Jost";
	let rectangle_width_previous = 0;
	let rectangle_offset_x = 0;
	for (let i = 0; i < main_ui.length; i++) {
		let ui = main_ui[i];
		let rectangle_width = ctx.measureText(ui.value).width + 100;

		if (
			rectangle_width_previous + rectangle_width >=
			350 + (400 - avatar_size)
		) {
			rectangle_width_previous = 0;
			rectangle_offset_x += 75;
		}

		ctx_extended.ez_rectangle(
			ctx,
			rectangle_width_previous + avatar_offset_x,
			rectangle_offset_x + 50,
			rectangle_width,
			60,
			15,
			"rgba(255, 255, 255, 0.5)"
		);
		ctx.drawImage(
			all_prerendered[ui.emoji],
			rectangle_width_previous + avatar_offset_x + 10,
			rectangle_offset_x + 55,
			50,
			50
		);
		ctx.fillText(
			`${ui.value}`,
			rectangle_width_previous + avatar_offset_x + 75,
			rectangle_offset_x + 96
		);

		rectangle_width_previous += rectangle_width + 15;
	}

	//USER AVATAR

	ctx_extended.drawAvatar(
		ctx,
		all_prerendered["user_avatar-test"],
		avatar_x,
		avatar_x,
		avatar_size,
		0.3
	);

	console.log(`AVATAR OFFSET X`, avatar_offset_x);

	return canvas.toBuffer("image/png");
};
