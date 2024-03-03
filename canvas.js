const canvas_file_path = "./src/htmls/game/canvas";
const canvas_folder_name = "./renders";

import fs from "fs";
import chokidar from "chokidar";
import path from "path";

async function importFile(file) {
	try {
		const abs_path = import.meta.dir + file.replace("./src", "/src");
		if (require.cache[abs_path]) {
			delete require.cache[abs_path];
		}
		return await import(file);
	} catch (error) {
		console.error("Error importing file:", error);
	}
}

async function render_canvas(file) {
	const canvas = await importFile(file);
	const buffer = await canvas.default();
	const fileName = path.basename(file);
	fs.writeFileSync(
		`${canvas_folder_name}/${fileName.replace(".js", "")}.png`,
		buffer
	);

	console.log(`Rendered ${file}`);
}

if (!fs.existsSync(canvas_folder_name)) {
	console.log(
		`canvas dev mode enabled, creating ${canvas_folder_name} folder...`
	);
	fs.mkdirSync(canvas_folder_name);
}

const canvas_files = fs.readdirSync(canvas_file_path);
for (const file of canvas_files) {
	await render_canvas(`${canvas_file_path}/${file}`);
}

chokidar.watch(canvas_file_path).on("change", async (file) => {
	await render_canvas("./" + file);
});

process.on("SIGINT", async () => {
	fs.rmdirSync(canvas_folder_name, { recursive: true });
	process.exit(0);
});
