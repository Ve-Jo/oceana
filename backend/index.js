import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.resolve(process.cwd(), "./../.env")})

fs.readdirSync("src").forEach(async (file) => {
	if (file.endsWith(".js")) {
		let module = await import(`./src/${file}`);
		if (module.default.execute) {
			await module.default.execute();
		}
	}
});
