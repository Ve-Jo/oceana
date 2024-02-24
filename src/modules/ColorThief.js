const ColorThief = require("colorthief");
const fs = require("fs");

module.exports = {
	closer_color: async function (url) {
		const rgbToHex = ([r, g, b]) =>
			[r, g, b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? "0" + hex : hex;
				})
				.join("");

		let cacheObj = JSON.parse(fs.readFileSync(process.env.CACHE_PATH));

		if (cacheObj["colorthief"][url]) {
			console.log("Returning from cache");
			return cacheObj["colorthief"][url];
		} else {
			let color = await ColorThief.getColor(url);
			let hex_color = rgbToHex(color);

			cacheObj["colorthief"][url] = hex_color;
			fs.writeFileSync(
				process.env.CACHE_PATH,
				JSON.stringify(cacheObj),
				"utf8"
			);

			return hex_color;
		}
	},
};
