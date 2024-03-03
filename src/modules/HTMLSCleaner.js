import fs from "fs";

export default function () {
	fs.rmdirSync("src/htmls/temp", { recursive: true });
	fs.unlinkSync(process.env.CACHE_PATH);
}
