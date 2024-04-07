import fs from "fs";
import ColorThief from "colorthief";

const cacheFilePath = "./temp/colorthief.json";
let cacheObj = {};

export default {
	closer_color: async function (url) {
		const rgbToHex = ([r, g, b]) =>
			[r, g, b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? "0" + hex : hex;
				})
				.join("");

		if (cacheObj[url]) {
			console.log("Returning from cache");
			return cacheObj[url];
		} else {
			let color;
			let hex_color;

			try {
				if (!fs.existsSync(cacheFilePath)) {
					fs.writeFileSync(cacheFilePath, "{}");
				}

				const data = fs.readFileSync(cacheFilePath, "utf8");
				const cacheData = JSON.parse(data);

				if (cacheData[url]) {
					hex_color = cacheData[url];
				} else {
					color = await ColorThief.getColor(url);
					hex_color = rgbToHex(color);

					cacheData[url] = hex_color;
					fs.writeFileSync(cacheFilePath, JSON.stringify(cacheData));
				}
			} catch (error) {
				console.error("Error reading or writing to colorthief.json:", error);
				color = await ColorThief.getColor(url);
				hex_color = rgbToHex(color);
			}

			cacheObj[url] = hex_color;
			return hex_color;
		}
	},
};
