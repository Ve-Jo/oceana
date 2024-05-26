import React, { useEffect, useRef, useState } from "react";
import { Noise } from "noisejs";

const noise = new Noise(1);
const noise2 = new Noise(2);

function hsvToRgb(h, s, v) {
	let r, g, b;
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
	}

	return { r: r * 255, g: g * 255, b: b * 255 };
}

function WaterBackgroundChunkRenderer(x, y, chunkSize, boatInfo, offset) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = chunkSize;
	canvas.height = chunkSize;

	const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
	gradient.addColorStop(0, "blue");
	gradient.addColorStop(1, "white");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const noiseScale = 0.005;
	const colorNoiseScale = 0.00008;
	const colorRandomness = 2;
	const pixelSize = 25;
	const threshold = 0.1;
	const colorBucketSize = 0.05;
	/*const mergeDistance = pixelSize * 1;*/

	let batches = new Map();
	let currentColor = null;

	let r, g, b;

	for (let i = 0; i < chunkSize; i += pixelSize) {
		for (let j = 0; j < chunkSize; j += pixelSize) {
			const noiseValue = noise.perlin2(
				(x * chunkSize + i) * noiseScale,
				(y * chunkSize + j) * noiseScale,
			);
			const noise2Value = noise2.perlin2(
				(x * chunkSize + i) * colorNoiseScale,
				(y * chunkSize + j) * colorNoiseScale,
			);

			const rotationAngle = colorRandomness * noise2Value + 90;
			const hue = Math.abs(rotationAngle) % 360;
			let res = hsvToRgb(hue, 0.5, 0.5);
			r = res.r;
			g = res.g;
			b = res.b;

			ctx.fillStyle = setColor(noiseValue, r, g, b);
			ctx.fillRect(i, j, pixelSize, pixelSize);

			if (noiseValue < threshold) {
				const colorBucket =
					Math.floor(noiseValue / colorBucketSize) * colorBucketSize;

				if (currentColor !== colorBucket) {
					processBatch(currentColor, batches, ctx, r, g, b);
					currentColor = colorBucket;
				}

				/*let collided = false;
					for (let [color, batch] of batches) {
						if (color - 0.1 < currentColor) {
							for (const item of batch) {
								if (
									Math.abs(item.x - i) < mergeDistance &&
									Math.abs(item.y - j) < mergeDistance
								) {
									item.width += pixelSize;
									item.height += pixelSize;
									collided = true;
									break;
								}
							}
						}
						if (collided) break;
					}

					if (!collided) {
						if (!batches.has(currentColor)) {
							batches.set(currentColor, []);
						}
						batches
							.get(currentColor)
							.push({ x: i, y: j, width: pixelSize, height: pixelSize });
					}
				}*/
			}
		}
	}

	processBatch(currentColor, batches, ctx, r, g, b);

	function processBatch(color, batches, ctx, r, g, b) {
		if (color == null || !batches.has(color)) return;

		ctx.fillStyle = setColor(color, r, g, b);

		ctx.beginPath();

		const batch = batches.get(color);
		for (const item of batch) {
			ctx.fillRect(item.x, item.y, item.width, item.height);
		}

		ctx.closePath();
		batches.delete(color);
	}

	function setColor(color, r, g, b) {
		const depthAdjustedRed = r + color * 5;
		const depthAdjustedGreen = g + Math.floor(-20 * color);
		const depthAdjustedBlue = b + color * 100;

		let finalRed = Math.min(255, Math.max(0, depthAdjustedRed));
		let finalGreen = Math.min(255, Math.max(0, depthAdjustedGreen));
		let finalBlue = Math.min(255, Math.max(0, depthAdjustedBlue));

		/*finalRed += Math.random() * 10 - 25;
		finalGreen += Math.random() * 10 - 25;
		finalBlue += Math.random() * 10 - 25;*/

		return `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;
	}

	return canvas.toDataURL();
}

export default function WaterBackgroundChunk({
	screen: { screenSize, setScreenSize },
	boatInfo: { boatInfo, setBoatInfo },
	savedBackgroundChunks: { savedBackgroundChunks, setSavedBackgroundChunks },
	currentPlayerChunkId: { currentPlayerChunkId, setCurrentPlayerChunkId },
}) {
	const canvasRef = useRef(null);

	async function renderChunk(x, y, chunkSize, boatInfo, offset) {
		return WaterBackgroundChunkRenderer(x, y, chunkSize, boatInfo, offset);
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = screenSize.x;
		canvas.height = screenSize.y;

		const chunk_size = 200;

		const maxChunks = {
			x: Math.floor(screenSize.x / chunk_size) + 2,
			y: Math.floor(screenSize.y / chunk_size) + 2,
		};

		const playerChunkId = [
			maxChunks.x - Math.floor(boatInfo.x / chunk_size),
			maxChunks.y - Math.floor(boatInfo.y / chunk_size),
		];

		const offset = {
			x: Math.floor(boatInfo.x / chunk_size) * chunk_size - boatInfo.x,
			y: Math.floor(boatInfo.y / chunk_size) * chunk_size - boatInfo.y,
		};

		const ctx = canvas.getContext("2d");

		const renderAndDrawChunk = async (chunkId, rectX, rectY, xId, yId) => {
			if (!savedBackgroundChunks[chunkId]) {
				console.log(`RENDERING CHUNK ${chunkId} AT ${rectX}, ${rectY}`);
				const chunk = await renderChunk(xId, yId, chunk_size, boatInfo, offset);
				const img = new Image();
				img.src = chunk;
				ctx.drawImage(
					img,
					rectX - offset.x - chunk_size,
					rectY - offset.y - chunk_size,
				);
				setSavedBackgroundChunks((prevChunks) => ({
					...prevChunks,
					[chunkId]: chunk,
				}));
			} else {
				const img = new Image();
				img.src = savedBackgroundChunks[chunkId];
				ctx.drawImage(
					img,
					rectX - offset.x - chunk_size,
					rectY - offset.y - chunk_size,
				);
			}
		};

		const renderChunks = async () => {
			for (let x = 0; x < maxChunks.x; x++) {
				for (let y = 0; y < maxChunks.y; y++) {
					const chunkId = `${x + playerChunkId[0]}-${y + playerChunkId[1]}`;
					const rectX = x * chunk_size;
					const rectY = y * chunk_size;
					await renderAndDrawChunk(
						chunkId,
						rectX,
						rectY,
						x + playerChunkId[0],
						y + playerChunkId[1],
					);
				}
			}
		};

		renderChunks();
	}, [boatInfo]);

	return <canvas ref={canvasRef} />;
}
