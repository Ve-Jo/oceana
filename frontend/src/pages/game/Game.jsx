import React, { useEffect, useState, useRef } from "react";
import "./Game.css";

import WindowResize from "../../components/WindowResize";
import BoatInfo from "../../components/BoatInfo";
import GameKeyboardControls from "../../components/GameKeyboardControls";
import WaterBackgroundChunk from "../../components/WaterBackgroundChunk";

function Game({ setCurrentPage, access_token }) {
	//MARK: Use states
	const [boatInfo, setBoatInfo] = useState({
		x: 0,
		y: 0,
		boat: {
			rotation_speed: { current: 0, max: 5 },
			rotation: 0,
			speed: { current: 0, max: 10 },
		},
	});

	const [keyState, setKeyState] = useState({});
	const [speed, setSpeed] = useState(0);
	const [rotationSpeed, setRotationSpeed] = useState(0);

	const [leftNotificationsPlacement, setLeftNotificationsPlacement] = useState({
		x: 15,
		y: -50,
		rotate: 0,
		mode: 0,
		transparency: 1,
	});

	const [screenSize, setScreenSize] = React.useState({
		x: window.innerWidth,
		y: window.innerHeight,
	});

	const [savedBackgroundChunks, setSavedBackgroundChunks] = useState({});
	const [currentPlayerChunkId, setCurrentPlayerChunkId] = useState([0, 0]);

	WindowResize({ screenSize, setScreenSize });

	BoatInfo(access_token);

	GameKeyboardControls({
		boatInfo: { boatInfo, setBoatInfo },
		speed: { speed, setSpeed },
		rotationSpeed: { rotationSpeed, setRotationSpeed },
		leftNotificationsPlacement: {
			leftNotificationsPlacement,
			setLeftNotificationsPlacement,
		},
		keyState: { keyState, setKeyState },
	});

	//MARK: Closest players
	/*const getDistance = (x1, y1, x2, y2) => {
		// Calculate the Euclidean distance between two points
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	};

	const getClosestPlayers = async () => {
		try {
			// Fetch all player data from the server
			const response = await fetch(`/api/multiplayer`);
			if (!response.ok) {
				throw new Error("Failed to fetch player data");
			}
			const allPlayers = await response.json();

			console.log(allPlayers);

			// Calculate distances between the target player and all other players
			const distances = allPlayers.map((player) => ({
				user_id: player.user_id,
				x: player.x,
				y: player.y,
				distance: getDistance(boatInfo.x, boatInfo.y, player.x, player.y),
			}));

			// Sort players by distance in ascending order
			distances.sort((a, b) => a.distance - b.distance);

			// Return the sorted list of players

			console.log(`DISTANCES: `);
			console.log(distances);

			return distances;
		} catch (error) {
			console.error("Error fetching player data:", error);
			return [];
		}
	};*/

	const [cachedWaterChunks, setCachedWaterChunks] = useState({});

	//MARK: Water background
	/*function WaterBackground({ canvasSize, player_x, player_y, fast_mode }) {
		const canvasRef = useRef(null);

		fast_mode = true;

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

			return {
				r: r * 255,
				g: g * 255,
				b: b * 255,
			};
		}

		useEffect(() => {
			if (!canvasRef.current) return;

			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			const noise = new Noise(1);
			const noise2 = new Noise(2);

			const noiseScale = 0.005;
			const colorNoiseScale = 0.00008;
			const colorRandomness = 2;

			const noise2Value = noise2.perlin2(
				player_x * colorNoiseScale,
				player_y * colorNoiseScale,
			);

			const rotationAngle = colorRandomness * noise2Value;
			const hue = Math.abs(rotationAngle) % 360;
			const { r, g, b } = hsvToRgb(hue, 0.5, 0.5);

			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;

			const pixelSize = 8;
			const threshold = 0.1;
			const colorBucketSize = fast_mode ? 0.1 : 0.02;
			const mergeDistance = pixelSize * (fast_mode ? 5 : 2);

			let batches = new Map();
			let currentColor = null;

			ctx.fillStyle = setColor(noise2Value);
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (let y = 0; y < canvas.height; y += pixelSize) {
				for (let x = 0; x < canvas.width; x += pixelSize) {
					const noiseValue = noise.perlin2(
						(x + player_x) * noiseScale,
						(y + player_y) * noiseScale,
					);

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

			function setColor(color) {
				const depthAdjustedRed = r + color;
				const depthAdjustedGreen = g + Math.floor(-100 * color);
				const depthAdjustedBlue = b + color;

				const finalRed = Math.min(255, Math.max(0, depthAdjustedRed));
				const finalGreen = Math.min(255, Math.max(0, depthAdjustedGreen));
				const finalBlue = Math.min(255, Math.max(0, depthAdjustedBlue));

				return `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;
			}

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
		}, [canvasSize, player_x, player_y]);

		return <canvas ref={canvasRef} />;
	}*/

	/*{WaterBackground({
				screen: { screenSize, setScreenSize },
				boatInfo: { boatInfo, setBoatInfo },
				savedBackgroundChunks: {
					savedBackgroundChunks,
					setSavedBackgroundChunks,
				},
				currentPlayerChunkId: { currentPlayerChunkId, setCurrentPlayerChunkId },
			})}*/

	//MARK: HTML
	return (
		<div
			id="background-g"
			className="absolute top-0 left-0 flex items-center justify-center w-full h-full"
		>
			<div id="boat">
				<div
					id="notifications_left"
					className="absolute text-white"
					style={{
						position: "absolute",
						marginTop: `${50 + leftNotificationsPlacement.y}px`,
						marginLeft: `${50 + leftNotificationsPlacement.x}px`,
						left: `calc(50% - 25px)`,
						top: `calc(50% - 25px)`,
						width: "auto",
						opacity: `${leftNotificationsPlacement.transparency}`,
						transform: `rotate(${Math.floor(leftNotificationsPlacement.rotate + rotationSpeed * 4)}deg)`,
					}}
				>
					<p
						className="mb-2"
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: "10px",
							padding: "10px",
						}}
					>
						Hello world!!!!
					</p>
					<p
						className="mb-2"
						style={{
							backgroundColor: "rgba(0, 0, 0, 0.5)",
							borderRadius: "10px",
							padding: "10px",
						}}
					>
						Hello world!!!!
					</p>
				</div>
				<img
					src="boat.png"
					alt="boat"
					className="w-10"
					style={{
						position: "absolute",
						left: `calc(50% - 25px)`,
						top: `calc(50% - 25px)`,
						imageRendering: "pixelated",
						transform: `rotate(${boatInfo.boat.rotation}deg)`,
					}}
				/>
			</div>
			<div className="absolute top-0 right-0 p-4">
				<h3 className="text-white">Boat Information</h3>
				<p className="text-white">X: {boatInfo.x.toFixed(1)}</p>
				<p className="text-white">Y: {boatInfo.y.toFixed(1)}</p>
				<p className="text-white">
					Rotation: {boatInfo.boat.rotation.toFixed(1)}
				</p>
				<p className="text-white">Speed: {speed.toFixed(1)}</p>
				<p className="text-white">
					Test: {leftNotificationsPlacement.x.toFixed(1)}{" "}
					{leftNotificationsPlacement.y.toFixed(1)}{" "}
					{leftNotificationsPlacement.rotate.toFixed(1)}{" "}
					{leftNotificationsPlacement.transparency.toFixed(1)}
				</p>
				<p>Rotate speed: {rotationSpeed.toFixed(1)}</p>
			</div>
			<WaterBackgroundChunk
				screen={{ screenSize, setScreenSize }}
				boatInfo={{ boatInfo, setBoatInfo }}
				savedBackgroundChunks={{
					savedBackgroundChunks,
					setSavedBackgroundChunks,
				}}
				currentPlayerChunkId={{ currentPlayerChunkId, setCurrentPlayerChunkId }}
			/>
		</div>
	);
}

export default Game;
