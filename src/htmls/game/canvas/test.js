import Canvas from "@napi-rs/canvas";

export default () => {
	let canvas = Canvas.createCanvas(600, 500);
	let ctx = canvas.getContext("2d");

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, 300, 500);

	ctx.fillStyle = "white";
	ctx.fillRect(300, 0, 300, 500);

	ctx.fillStyle = "red";
	ctx.fillRect(0, 0, 600, 250);

	return canvas.toBuffer("image/png");
};
