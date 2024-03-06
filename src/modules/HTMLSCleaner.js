import fs from "fs";

export default async function () {
	fs.unlinkSync("./temp.json");
	fs.rmdirSync("src/htmls/temp", { recursive: true });
	if (process.env.CANVAS_PRERENDER === "true") {
		fs.rmdirSync("./renders", { recursive: true });
	}
}
