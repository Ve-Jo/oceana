import Canvas from "@napi-rs/canvas";
import ctx_extended from "./../../../modules/Canvas.js";

import { createNoise3D, createNoise2D } from "simplex-noise";
import alea from "alea";

import User from "./../../../models/UserModel";

Canvas.GlobalFonts.loadFontsFromDir("fonts");

const depth3D = createNoise2D(alea("1"));
const locationDepth3D = createNoise2D(alea("2"));

export async function WaterBackground({
	user,
	canvas,
	last_coordinates,
	coordinates_now,
	fast_mode,
}) {
	let canvas_wtr;
	let coordinate_difference;
	if (
		typeof canvas !== "undefined" &&
		typeof last_coordinates === "object" &&
		coordinates_now.x === last_coordinates.x &&
		coordinates_now.y === last_coordinates.y
	) {
		console.log("RETURNING ALREADY RENDERED WATER");
		return [canvas, { x: user.x, y: user.y }];
	} else {
		console.log("MAKING NEW WATER");
		canvas_wtr = Canvas.createCanvas(800, 1400);

		console.log(coordinates_now.x, coordinates_now.y);
		console.log(last_coordinates?.x, last_coordinates?.y);

		coordinate_difference = {
			x: coordinates_now.x - (last_coordinates?.x || 0),
			y: coordinates_now.y - (last_coordinates?.y || 0),
		};
	}
	const ctx_w = canvas_wtr.getContext("2d");

	ctx_w.fillStyle = "rgb(0, 0, 255)";
	ctx_w.fillRect(0, 0, canvas_wtr.width, canvas_wtr.height);

	let pixelSize = 6;
	let scale = 0.002;

	const threshold = 0.001;
	const colorBucketSize = fast_mode ? 0.1 : 0.01;
	const mergeDistance = pixelSize * (fast_mode ? 10 : 2);

	let batches = new Map();
	let currentColor = null;

	for (let y = 0; y < canvas_wtr.height; y += pixelSize) {
		for (let x = 0; x < canvas_wtr.width; x += pixelSize) {
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
	ctx_w.filter = "none";
	processBatch(currentColor, batches);
	function processBatch(color, batches) {
		if (!color || !batches.has(color)) return;
		ctx_w.fillStyle = `rgb(0, ${Math.floor(-140 * color)}, 255)`;
		ctx_w.beginPath();

		const batch = batches.get(color);
		for (const item of batch) {
			ctx_w.fillRect(item.x, item.y, item.width, item.height);
		}

		ctx_w.closePath();
		batches.delete(color);
	}
	return [ctx_w, { x: user.x, y: user.y }];
}

export async function ImagesPrerenderer({
	all_emoji_used,
	all_images_used,
	all_prerendered,
}) {
	if (!all_prerendered) all_prerendered = {};
	await Promise.all(
		all_emoji_used.map(async (emoji) => {
			let emoji_img = await ctx_extended.loadLocalImage(
				"emojis",
				`${emoji}.png`
			);
			all_prerendered[emoji] = emoji_img;
		})
	);
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
	return all_prerendered;
}

export async function GameTopUI({
	main_ui,
	ctx,
	all_prerendered,
	avatar_disabled,
	scale,
	vertical_offset,
	horizontal_offset,
	offset_boat,
	text_y,
	emoji_y,
	emoji_offset,
	next_line_width,
	font_scale,
	offset_between_rectangles,
	inverse_rectangles,
	avatar_offsetx,
	avatar_offsety,
}) {
	let rectangle_width_previous = 0;
	let rectangle_offset_x = 0;

	let font_size = 45 * (font_scale || 1);
	let emoji_size = 50;
	let rectangle_height = 60;
	let next_line_at = next_line_width || 400;
	let rectangle_offset_inc = inverse_rectangles ? -75 : 75;
	let rectangle_offset_x_inc = offset_between_rectangles || 15;
	let rectangle_roundness = 15;
	let no_emoji_move = 20;
	let boat_mode_offset = 0;

	let text_y_fix = text_y || 0;
	let emoji_fix_y = emoji_y || 0;

	let avatar_size = 150 - main_ui.length * 5;
	let avatar_x = 50 + avatar_offsetx || 50;
	let avatar_y = avatar_offsety || 50;
	let avatar_offset_x = avatar_x + avatar_size + 25;

	if (avatar_disabled) {
		avatar_size = 0;
		avatar_x = 0;
		avatar_offset_x = 0;
	}

	if (vertical_offset) {
		rectangle_offset_x = vertical_offset;
	}
	if (horizontal_offset) {
		avatar_offset_x = horizontal_offset;
	}
	if (offset_boat) {
		boat_mode_offset = offset_boat;
	}

	if (scale) {
		font_size = font_size * scale;
		emoji_size = emoji_size * scale * 0.95;
		rectangle_height = rectangle_height * scale;
		next_line_at = next_line_at * scale - horizontal_offset;
		rectangle_offset_inc = rectangle_offset_inc * scale;
		rectangle_offset_x_inc = rectangle_offset_x_inc * scale;
		rectangle_roundness = rectangle_roundness * scale;
		no_emoji_move = no_emoji_move * scale;
	}

	ctx.fillStyle = "white";

	for (let i = 0; i < main_ui.length; i++) {
		let ui = main_ui[i];

		if (ui.type === "graph") {
			ctx.font = `900 ${font_size / 1.5}px Jost`;
		} else {
			ctx.font = `900 ${font_size}px Jost`;
		}

		let rectangle_width = 0;
		rectangle_width = ctx.measureText(ui.value || "").width + 10;
		if (ui.value) rectangle_width += 20;

		if (ui.emoji) {
			rectangle_width += ctx.measureText(ui.emoji).width + 40;
		}
		if (!ui.emoji) rectangle_width += no_emoji_move;

		if (rectangle_width_previous + rectangle_width >= next_line_at) {
			rectangle_width_previous = 0;
			rectangle_offset_x += rectangle_offset_inc;
		}

		if (ui.type !== "graph") {
			ctx_extended.ez_rectangle(
				ctx,
				rectangle_width_previous + avatar_offset_x,
				rectangle_offset_x + 50 + boat_mode_offset,
				rectangle_width - boat_mode_offset,
				rectangle_height,
				rectangle_roundness,
				"rgba(255, 255, 255, 0.5)"
			);
		}

		if (ui.type == "graph") {
			if (!ui.bgcolor) ui.bgcolor = "50, 200, 255";
			ctx_extended.ez_rectangle(
				ctx,
				rectangle_width_previous + avatar_offset_x,
				rectangle_offset_x + 50 + boat_mode_offset,
				rectangle_width - boat_mode_offset,
				rectangle_height,
				rectangle_roundness,
				`rgba(${ui.bgcolor}, 0.3)`
			);
			if (ui.min_value < 10) ui.min_value = 10;
			ctx_extended.ez_rectangle(
				ctx,
				rectangle_width_previous + avatar_offset_x,
				rectangle_offset_x + 50 + boat_mode_offset,
				(ui.min_value / ui.max_value) * rectangle_width - boat_mode_offset,
				rectangle_height,
				rectangle_roundness,
				`rgba(${ui.bgcolor}, 0.5)`
			);
		}

		let visible_x = emoji_offset || 0;

		if (ui.emoji) {
			if (scale) {
				emoji_fix_y = visible_x / 2;
			}
			visible_x = emoji_size + 25;
			ctx.drawImage(
				all_prerendered[ui.emoji],
				rectangle_width_previous + avatar_offset_x + 10,
				rectangle_offset_x + 55 + emoji_fix_y,
				emoji_size,
				emoji_size
			);
		}

		if (ui.value) {
			if (scale) {
				emoji_fix_y = visible_x * scale - (60 - 10 * (scale / 10));
			}
			ctx.fillText(
				`${ui.value}`,
				rectangle_width_previous + avatar_offset_x + visible_x,
				rectangle_offset_x + 96 + emoji_fix_y + text_y_fix
			);
		}

		rectangle_width_previous += rectangle_width + rectangle_offset_x_inc;
	}

	if (!avatar_disabled) {
		ctx_extended.drawAvatar(
			ctx,
			all_prerendered["user_avatar-test"],
			avatar_x,
			avatar_y,
			avatar_size,
			0.3
		);
	}
}

export async function UIRender({ user, ctx_ui, all_prerendered }) {
	if (typeof ctx_ui !== "undefined" && ctx_ui?.canvas && !user.ui_updated) {
		return ctx_ui;
	} else {
		user.ui_updated = 0;
	}
	let canvas_ui = Canvas.createCanvas(800, 1400);
	ctx_ui = canvas_ui.getContext("2d");
	let main_ui = [
		{
			emoji: "💵",
			value: user.money.toFixed(1),
		},
		{
			emoji: "💎",
			value: user.diamonds.toFixed(2),
		},
		{
			emoji: "🌠",
			type: "graph",
			min_value: 10,
			max_value: 100,
			value: "LVL 0 (0/100)",
		},
	];

	let inventory = [
		{
			emoji: "🎒",
			type: "graph",
			min_value: 20,
			max_value: 100,
			value: "0 / 10kg",
		},
		{
			emoji: "🎣",
			type: "graph",
			min_value: 100,
			max_value: 100,
			value: "100%",
		},
		{
			emoji: "🐸",
			value: "2x",
		},
	];

	let bottom = [
		{
			emoji: "☀️",
			value: "День 1",
		},
		{
			emoji: "🗺️",
			value: "1м",
		},
	];

	await GameTopUI({
		main_ui,
		ctx: ctx_ui,
		user,
		all_prerendered,
		vertical_offset: 50,
		avatar_offsety: 100,
	});

	await GameTopUI({
		main_ui: bottom,
		ctx: ctx_ui,
		user,
		all_prerendered,
		avatar_disabled: true,
		scale: 0.75,
		vertical_offset: -25,
		horizontal_offset: 50,
		offset_boat: 10,
		text_y: 15,
		next_line_width: 800,
		emoji_offset: 20,
		offset_between_rectangles: 2,
	});

	await GameTopUI({
		main_ui: inventory,
		ctx: ctx_ui,
		user,
		all_prerendered,
		avatar_disabled: true,
		vertical_offset: 1250,
		horizontal_offset: 44,
		next_line_width: 720,
		offset_boat: 0,
		text_y: 0,
		font_scale: 1,
		offset_between_rectangles: 10,
		inverse_rectangles: true,
	});
	ctx_ui = canvas_ui.getContext("2d");
	return ctx_ui;
}

export async function ImagesPrerender({ interaction }) {
	let all_text = {
		user_avatar_url:
			typeof interaction == "object"
				? "https://cdn.discordapp.com/avatars/287275956744355841/74b466b6e166b3ee9f01e2c37ad9425b.png?size=2048"
				: interaction.user.displayAvatarURL(),
	};

	return await ImagesPrerenderer({
		all_emoji_used: [
			"🗺️",
			"👋",
			"💵",
			"💎",
			"🌠",
			"☀️",
			"🎣",
			"🐸",
			"🎒",
			"❤️",
			"⏩",
		],
		all_images_used: [
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
		],
	});
}

/*let user = await User.findOneAndUpdate(
	{ id: "287275956744355841" },
	{ upsert: true, new: true }
);

let ui_canvas;
let all_prerendered;
let water_prerendered;
let interaction = null;*/

export default async ({
	user,
	ui_canvas,
	all_prerendered,
	water_prerendered,
	water_prerendered_coordinates,
	water_fast_mode,
}) => {
	let less_file_size = false;

	/*let user = await User.findOneAndUpdate(
		{ id: "287275956744355841" },
		{ upsert: true, new: true }
	);*/

	if (!all_prerendered) {
		all_prerendered = await ImagesPrerender({ interaction });
	}

	let boat_notifications = [
		{
			emoji: "❤️",
			value: "75 / 100",
			type: "graph",
			bgcolor: "255, 157, 0",
			min_value: 75,
			max_value: 100,
		},
	];

	if (user.boat.speed.current > 0) {
		boat_notifications.push({
			emoji: "⏩",
			value: user.boat.speed.current < user.boat.speed.max ? "Скорость" : "",
			type: "graph",
			min_value: user.boat.speed.current,
			max_value: user.boat.speed.max,
		});
	}

	let canvas = Canvas.createCanvas(800, 1400);
	let ctx = canvas.getContext("2d");

	const noiseValue = locationDepth3D(user.x * 0.00005, user.y * 0.00002);

	ctx.filter = `hue-rotate(${noiseValue * 360}deg); contrast(${
		noiseValue * 2
	}%)`;

	let water_prerendered_r = await WaterBackground({
		user,
		canvas: water_prerendered,
		last_coordinates: water_prerendered_coordinates,
		coordinates_now: { x: user.x, y: user.y },
		fast_mode: water_fast_mode,
	});
	ctx.drawImage(water_prerendered_r[0].canvas, 0, 0);

	ctx.imageSmoothingEnabled = false;
	let image = await Canvas.loadImage(all_prerendered["boat"]);
	ctx.save();
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate(user.boat.rotation * (Math.PI / 180));
	ctx.drawImage(image, -50, -100, 100, 200);

	let rotation = Math.abs(user.boat.rotation % 360);

	if (rotation >= 60 && rotation < 130) {
		ctx.translate(175, 175);
		ctx.rotate((Math.PI / 180) * -90);
	} else if (rotation >= 130 && rotation < 220) {
		ctx.translate(0, 10);
		ctx.rotate((Math.PI / 180) * -180);
	} else if (rotation >= 220 && rotation < 320) {
		ctx.translate(-175, -175);
		ctx.rotate((Math.PI / 180) * -270);
	} else if (rotation >= 320) {
		ctx.translate(0, 0);
		ctx.rotate((Math.PI / 180) * 360);
	}

	await GameTopUI({
		main_ui: boat_notifications,
		ctx: ctx,
		all_prerendered,
		avatar_disabled: true,
		scale: 0.75,
		vertical_offset: -170,
		horizontal_offset: 65,
		offset_boat: 10,
		text_y: 15,
		emoji_offset: 17,
		next_line_width: 550,
		offset_between_rectangles: 5,
	});

	ctx.restore();
	ctx.imageSmoothingEnabled = true;

	let ready = await UIRender({ user, ctx_ui: ui_canvas, all_prerendered });
	ui_canvas = ready;
	ctx.drawImage(ready.canvas, 0, 0);

	/*for (let fish of user.world.staff) {
		let fishImage = await Canvas.loadImage(all_prerendered["fish"]);

		const fishOffsetX = fish.x + user.x;
		const fishOffsetY = fish.y + user.y;

		if (
			fishOffsetX >= 0 &&
			fishOffsetX <= canvas.width &&
			fishOffsetY >= 0 &&
			fishOffsetY <= canvas.height
		) {
			ctx.drawImage(fishImage, fishOffsetX, fishOffsetY, 40, 35);
		}
	}*/

	return canvas.toBuffer("image/jpeg", less_file_size ? 50 : 90);
};
