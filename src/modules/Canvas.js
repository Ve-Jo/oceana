import { Resvg } from "@resvg/resvg-js";
import { join } from "path";
import axios from "axios";
import fs from "fs";
import { parse } from "twemoji-parser";
import { Image } from "@napi-rs/canvas";

axios.defaults.headers.common["Accept-Encoding"] = "gzip";

export async function loadLocalImage(imagePath, imageName) {
	return new Promise(async (resolve, reject) => {
		const cachedImagePath = join(imagePath, imageName);

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

export async function save_emojis(emoji) {
	const imagesDirectory = join(import.meta.dir, "../../", "emojis");
	console.log(imagesDirectory);
	if (!fs.existsSync(imagesDirectory)) {
		fs.mkdirSync(imagesDirectory);
	}
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

export async function ez_rectangle(ctx, x, y, width, height, roundness, color) {
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
}
