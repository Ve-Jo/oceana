import Canvas from "@napi-rs/canvas";
import path from "path";
import ctx_extended from "./../../../modules/Canvas.js";

/*import User from "./../../../models/UserModel";*/

export default async (user) => {
	/*let user = await User.findOne({ id: "287275956744355841" });*/

	let all_images_used = [
		{
			image_name: "boat",
			image_url: "./src/htmls/sources/icons/boat.png",
			localImage: true,
		},
		{
			image_name: "fish",
			image_url: "./src/htmls/sources/icons/fish.png",
			localImage: true,
		},
	];
	let all_prerendered = {};

	let canvas = Canvas.createCanvas(600, 500);
	let ctx = canvas.getContext("2d");

	console.time("loadLocalImages");
	await Promise.all(
		all_images_used.map(async (image) => {
			let image_img = await ctx_extended.loadImage(
				image.image_name,
				image.image_url,
				image.localImage
			);
			all_prerendered[image.image_name] = image_img;
		})
	);
	console.timeEnd("loadLocalImages");

	ctx.imageSmoothingEnabled = false;

	ctx.fillStyle = "lightblue";
	ctx.fillRect(0, 0, 600, 500);

	ctx.save();
	ctx.translate(300, 250);
	ctx.rotate((-user.boat.rotation * Math.PI) / 180);
	ctx.translate(-300, -250);
	ctx.fillStyle = "white";
	ctx.fillRect(290, 210, 20, 90);
	ctx.restore();

	let image = await Canvas.loadImage(all_prerendered["boat"]);
	ctx.drawImage(image, 275, 200, 50, 100);

	for (let fish of user.world.staff) {
		let fishImage = await Canvas.loadImage(all_prerendered["fish"]);

		const fishOffsetX =
			275 +
			(user.x - fish.x) * Math.cos((-user.boat.rotation * Math.PI) / 180) -
			(user.y - fish.y) * Math.sin((-user.boat.rotation * Math.PI) / 180);
		const fishOffsetY =
			200 +
			(user.x - fish.x) * Math.sin((-user.boat.rotation * Math.PI) / 180) +
			(user.y - fish.y) * Math.cos((-user.boat.rotation * Math.PI) / 180);

		ctx.drawImage(fishImage, fishOffsetX, fishOffsetY, 35, 35);
	}

	return canvas.toBuffer("image/png");
};
