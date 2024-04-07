export default async function (path_str) {
	if (process.isBun) {
		return path_str;
	} else {
		const path = path_str.replace(/([A-Z]:\\)/g, "file:///");
		const absolutePath = `${path}`;
		console.log(absolutePath);
		return absolutePath;
	}
}
