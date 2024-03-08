import { Resvg } from "@resvg/resvg-js";
import { join } from "path";
import path from "path";
import axios from "axios";
import fs from "fs";
import { parse } from "twemoji-parser";
import canvas, { Image, Path2D } from "@napi-rs/canvas";

axios.defaults.headers.common["Accept-Encoding"] = "gzip";

let canvas_cached_imgs = {};

async function loadLocalImage(imagePath, imageName) {
	return new Promise(async (resolve, reject) => {
		const cachedImagePath = join(imagePath, imageName);

		if (!fs.existsSync(imagePath)) {
			fs.mkdirSync(imagePath);
		}

		if (fs.existsSync(cachedImagePath)) {
			fs.readFile(cachedImagePath, (err, data) => {
				if (err) {
					reject(err);
					console.log(err);
				} else {
					const img = new Image();
					img.src = data;
					resolve(img);
				}
			});
		} else {
			await save_emojis(imageName.replace(".png", ""));
			const img = new Image();
			img.src = fs.readFileSync(cachedImagePath);
			resolve(img);
		}
	});
}

async function loadImage(image_name, image, localImage) {
	console.log({
		image_name,
		image,
		localImage,
	});

	const rendersDirectory = "./temp";
	if (!fs.existsSync(rendersDirectory)) {
		fs.mkdirSync(rendersDirectory);
	}

	const imagePath = path.join(rendersDirectory, `${image_name}.png`);
	console.log(imagePath);

	if (localImage) {
		if (canvas_cached_imgs[image_name]) {
			return canvas_cached_imgs[image_name];
		} else {
			canvas_cached_imgs[image_name] = await canvas.loadImage(image);
			return canvas_cached_imgs[image_name];
		}
	} else if (fs.existsSync(imagePath)) {
		console.time("Returning from cache");
		console.log("Returning from cache");
		return canvas.loadImage(imagePath);
	} else {
		try {
			console.time("Fetching and caching image");
			const response = await axios.get(image, { responseType: "arraybuffer" });
			const buffer = Buffer.from(response.data, "binary");
			fs.writeFileSync(imagePath, buffer);
			return canvas.loadImage(buffer);
		} catch (error) {
			console.error("Error fetching or caching image:", error);
			throw error;
		}
	}
}

async function save_emojis(emoji) {
	const imagesDirectory = join(import.meta.dir, "../../", "emojis");
	console.log(imagesDirectory);
	try {
		const emojiData = parse(emoji);
		for (const emojiInfo of emojiData) {
			console.log(emojiInfo);
			const emojiFileName = `${emojiInfo.text}.png`;
			const emojiFilePath = join(imagesDirectory, emojiFileName);

			const response = await axios.get(emojiInfo.url);
			const svgBuffer = response.data;

			const resvg = new Resvg(svgBuffer, {
				fitTo: { mode: "width", value: 512 },
			});
			const pngData = resvg.render();
			const pngBuffer = pngData.asPng();

			fs.writeFileSync(emojiFilePath, pngBuffer);
		}
	} catch (error) {
		console.error("Error fetching or caching emoji images:", error);
		throw error;
	}
}

async function ez_rectangle(ctx, x, y, width, height, roundness, color) {
	ctx.save();

	ctx.beginPath();
	ctx.moveTo(x + roundness, y);
	ctx.lineTo(x + width - roundness, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + roundness);
	ctx.lineTo(x + width, y + height - roundness);
	ctx.quadraticCurveTo(
		x + width,
		y + height,
		x + width - roundness,
		y + height
	);
	ctx.lineTo(x + roundness, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - roundness);
	ctx.lineTo(x, y + roundness);
	ctx.quadraticCurveTo(x, y, x + roundness, y);
	ctx.closePath();

	ctx.fillStyle = color;
	ctx.fill();

	ctx.restore();
}

async function drawAvatar(
	ctx,
	avatarImage,
	avatarX,
	avatarY,
	avatarSize,
	roundness
) {
	ctx.save();

	const clipPath = new Path2D();
	const cornerRadius = avatarSize * roundness;
	clipPath.moveTo(avatarX + cornerRadius, avatarY);
	clipPath.arcTo(
		avatarX + avatarSize,
		avatarY,
		avatarX + avatarSize,
		avatarY + avatarSize,
		cornerRadius
	);
	clipPath.arcTo(
		avatarX + avatarSize,
		avatarY + avatarSize,
		avatarX,
		avatarY + avatarSize,
		cornerRadius
	);
	clipPath.arcTo(avatarX, avatarY + avatarSize, avatarX, avatarY, cornerRadius);
	clipPath.arcTo(avatarX, avatarY, avatarX + avatarSize, avatarY, cornerRadius);
	ctx.clip(clipPath);

	console.log(avatarImage);
	ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);

	ctx.restore();
}

async function fillLongText(ctx, text, x, y, maxWidth, lineHeight) {
	let words = text.split(" ");
	let line = "";
	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + " ";
		let metrics = ctx.measureText(testLine);
		let testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			ctx.fillText(line, x, y);
			line = words[n] + " ";
			y += lineHeight;
		} else {
			line = testLine;
		}
	}
	ctx.fillText(line, x, y);
}

async function autoTextFont(ctx, text, width, font, isBold) {
	let size = 100;
	ctx.font = `${isBold ? "900 " : ""}${size}px ${font}`;
	while (ctx.measureText(text).width > width) {
		size--;
		ctx.font = `${isBold ? "900 " : ""}${size}px ${font}`;
	}
}

export default {
	loadImage,
	loadLocalImage,
	save_emojis,
	ez_rectangle,
	drawAvatar,
	fillLongText,
	autoTextFont,
};
