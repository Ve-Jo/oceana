import fs from "fs";

let cacheObj = { colorthief: {} };

export default () => {
	const temp_file_path = "./temp.json";
	try {
		if (!fs.existsSync(temp_file_path)) {
			fs.writeFileSync(temp_file_path, JSON.stringify(cacheObj), "utf8");
		}
	} catch (err) {
		console.log("Error while writing to file: ", err);
	}
};
