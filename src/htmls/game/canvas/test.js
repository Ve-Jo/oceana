import Canvas from "@napi-rs/canvas";
import path from "path";

/*import User from "./../../../models/UserModel";*/

export default async (user) => {
	/*let user = await User.findOne({ id: "287275956744355841" });*/

	let canvas = Canvas.createCanvas(600, 500);
	let ctx = canvas.getContext("2d");

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

	let imagePath = path.resolve(
		import.meta.dir,
		"./../../sources/icons/boat.png"
	);
	let image = await Canvas.loadImage(imagePath);
	ctx.drawImage(image, 275, 200, 50, 100);

	for (let fish of user.world.staff) {
		let fishPath = path.resolve(
			import.meta.dir,
			`./../../sources/icons/fish.png`
		);
		let fishImage = await Canvas.loadImage(fishPath);

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
