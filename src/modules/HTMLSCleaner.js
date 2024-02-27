import fs from "fs";

export default function () {
	const temp_htmls = fs.readdirSync("src/htmls/temp");
	for (const file of temp_htmls) {
		fs.unlinkSync(`src/htmls/temp/${file}`);
	}
	fs.unlinkSync(process.env.CACHE_PATH);
}
