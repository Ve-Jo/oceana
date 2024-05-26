import React, { useEffect, useRef } from "react";

export default function PerlinNoiseCanvas({ screenSize, boatInfo }) {
	const canvasRef = useRef(null);
	const water_noise_chunks_scale_width = screenSize.x / 22;
	const water_noise_chunks_scale_height = screenSize.y / 22;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return console.log(`No water!`);
		console.log(`Water exists!`);

		console.log(screenSize);

		canvas.width = screenSize.x;
		canvas.height = screenSize.y;

		const ctx = canvas.getContext("2d");

		let intervalId;
		if (intervalId) {
			clearInterval(intervalId);
		}
		intervalId = setInterval(() => {
			ctx.fillStyle = `rgba(0, 0, 0, 0)`;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (
				let noise_x = 0;
				noise_x < canvas.width;
				noise_x += canvas.width / water_noise_chunks_scale_width
			) {
				for (
					let noise_y = 0;
					noise_y < canvas.height;
					noise_y += canvas.height / water_noise_chunks_scale_height
				) {
					const waterNoise = Math.random();
					const waterNoiseColor = `rgba(${waterNoise * 255}, ${
						waterNoise * 255
					}, ${waterNoise * 255}, 0.02)`;
					ctx.fillStyle = waterNoiseColor;

					ctx.fillRect(
						noise_x,
						noise_y,
						screenSize.x / water_noise_chunks_scale_width,
						screenSize.y / water_noise_chunks_scale_height,
					);
				}
			}
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return <canvas ref={canvasRef} />;
}
