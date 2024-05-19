import React, { useEffect, useRef } from "react";
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

async function WaterBackgroundChunkRenderer(x, y, chunkSize) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	canvas.width = chunkSize;
	canvas.height = chunkSize;

	const noiseScale = 0.005;
	const colorNoiseScale = 0.00008;
	const colorRandomness = 2;
	const pixelSize = 8;
	const threshold = 0.1;
	const colorBucketSize = 0.1;
	const mergeDistance = pixelSize * 5;

	let batches = new Map();
	let currentColor = null;

	for (let i = 0; i < chunkSize; i++) {
		for (let j = 0; j < chunkSize; j++) {
			const noiseValue = noise.perlin2(
				(x * chunkSize + i) * noiseScale,
				(y * chunkSize + j) * noiseScale,
			);
			const noise2Value = noise2.perlin2(
				x * colorNoiseScale,
				y * colorNoiseScale,
			);

			const rotationAngle = colorRandomness * noise2Value;
			const hue = Math.abs(rotationAngle) % 360;
			const { r, g, b } = hsvToRgb(hue, 0.5, 0.5);

			function setColor(color) {
				const depthAdjustedRed = r + color;
				const depthAdjustedGreen = g + Math.floor(-100 * color);
				const depthAdjustedBlue = b + color;

				const finalRed = Math.min(255, Math.max(0, depthAdjustedRed));
				const finalGreen = Math.min(255, Math.max(0, depthAdjustedGreen));
				const finalBlue = Math.min(255, Math.max(0, depthAdjustedBlue));

				return `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;
			}

			ctx.fillStyle = setColor(noiseValue);
			ctx.fillRect(i, j, pixelSize, pixelSize);

			if (noiseValue < threshold) {
				const colorBucket =
					Math.floor(noiseValue / colorBucketSize) * colorBucketSize;

				if (currentColor !== colorBucket) {
					processBatch(currentColor, batches, ctx);
					currentColor = colorBucket;
				}

				let collided = false;
				for (let [color, batch] of batches) {
					if (color - 0.1 < currentColor) {
						for (const item of batch) {
							if (
								Math.abs(item.x - x) < mergeDistance &&
								Math.abs(item.y - y) < mergeDistance
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
						.push({ x, y, width: pixelSize, height: pixelSize });
				}
			}
		}
	}

	processBatch(currentColor, batches, ctx);

	function processBatch(color, batches, ctx) {
		if (!color || !batches.has(color)) return;

		ctx.fillStyle = setColor(color);

		ctx.beginPath();

		const batch = batches.get(color);
		for (const item of batch) {
			ctx.fillRect(item.x, item.y, item.width, item.height);
		}

		ctx.closePath();
		batches.delete(color);
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
	const [savedChunks, setSavedChunks] = useState({});

	useEffect(() => {
		async function renderChunk(x, y, chunkSize) {
			return await WaterBackgroundChunkRenderer(x, y, chunkSize);
		}

		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = screenSize.x;
		canvas.height = screenSize.y;

		const chunk_size = 100;

		const playerChunkId = [
			Math.floor(boatInfo.x / 100),
			Math.floor(boatInfo.y / 100),
		];

		const maxChunks = {
			x: Math.floor(screenSize.x / 100) + 1,
			y: Math.floor(screenSize.y / 100) + 1,
		};

		const offset = {
			x: boatInfo.x - Math.floor(boatInfo.x / 100) * 100,
			y: boatInfo.y - Math.floor(boatInfo.y / 100) * 100,
		};

		const ctx = canvas.getContext("2d");

		const renderAndDrawChunk = async (chunkId, rectX, rectY) => {
			if (!savedChunks[chunkId]) {
				console.log(`RENDERING CHUNK ${chunkId} AT ${rectX}, ${rectY}`);
				const chunk = await renderChunk(rectX, rectY, chunk_size);
				const img = new Image();
				img.src = chunk;
				img.onload = () => {
					ctx.drawImage(img, rectX, rectY);
					setSavedChunks((prevChunks) => ({
						...prevChunks,
						[chunkId]: chunk,
					}));
				};
			} else {
				const img = new Image();
				img.src = savedChunks[chunkId];
				img.onload = () => {
					ctx.drawImage(img, rectX, rectY);
				};
			}
		};

		for (let x = 0; x < maxChunks.x; x++) {
			for (let y = 0; y < maxChunks.y; y++) {
				const chunkId = `${x + playerChunkId[0]}-${y + playerChunkId[1]}`;
				const rectX = x * chunk_size - offset.x;
				const rectY = y * chunk_size - offset.y;
				renderAndDrawChunk(chunkId, rectX, rectY);
			}
		}
	}, [boatInfo, screenSize, savedChunks, setSavedChunks]);

	return <canvas ref={canvasRef} />;
}
