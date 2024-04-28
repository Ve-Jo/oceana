import React, { useEffect, useState, useRef } from "react";
import "./Game.css";
import { Noise } from "noisejs";

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

	const [screenSize, setScreenSize] = useState({
		x: window.innerWidth,
		y: window.innerHeight,
	});
	const canvasSize = { width: screenSize.x, height: screenSize.y };
	const [latestMultiplayerCheck, multiplayerCheck] = useState(0);

	useEffect(() => {
		const handleResize = () => {
			setScreenSize({ x: window.innerWidth, y: window.innerHeight });
		};

		const handleBeforeUnload = () => {
			savePlayerInformation();
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	const createPlayerMultiplayer = async (access_token, data) => {
		try {
			console.log(`UPDATING DATA WITH BOAT ROTATION: `);
			console.log(`${data.boat.rotation}`);
			const response = await fetch(`/api/multiplayer`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					user_id: access_token.user.id,
					x: data.x,
					y: data.y,
					boat: { rotation: data.boat.rotation },
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to create player");
			}
			console.log("Player created successfully");
		} catch (error) {
			console.error("Error creating player:", error);
		}
	};

	// MARK: Boat information
	useEffect(() => {
		const fetchBoatInfo = async () => {
			try {
				const response = await fetch(`/api/users/${access_token.user.id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch boat information");
				}
				const data = await response.json();
				if (!data) {
					fetchBoatInfo();
				} else {
					setBoatInfo(data);
					await createPlayerMultiplayer(access_token, data);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchBoatInfo();
	}, [access_token]);

	const savePlayerInformation = () => {
		//MARK: TODO: Save
	};

	const getDistance = (x1, y1, x2, y2) => {
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
	};

	//MARK: Water background
	function WaterBackground({ canvasSize, player_x, player_y, fast_mode }) {
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
	}

	//MARK: Keyboard controls
	useEffect(() => {
		const handleKeyPress = () => {
			let newX = boatInfo.x;
			let newY = boatInfo.y;
			let newRotation = boatInfo.boat.rotation;
			let newSpeed = speed;
			let newRotationSpeed = rotationSpeed;

			const rotationThreshold = 5; // Adjust as needed
			const speedThreshold = 0.1; // Adjust as needed

			const rotation_snappy = [90, 180, 270, 360, 0, 45, 135, 225, 315];
			const rotation_max_to_span = 10;

			if (keyState.ArrowLeft || keyState.ArrowRight) {
				//limits
				if (newRotationSpeed >= boatInfo.boat.rotation_speed.max) {
					newRotationSpeed = boatInfo.boat.rotation_speed.max;
				}
				if (newRotationSpeed <= -boatInfo.boat.rotation_speed.max) {
					newRotationSpeed = -boatInfo.boat.rotation_speed.max;
				}

				//right and left
				if (keyState.ArrowRight) {
					if (newRotationSpeed < 0) newRotationSpeed += 1;
					newRotationSpeed += 0.1;
					newRotation += newRotationSpeed;
				} else if (keyState.ArrowLeft) {
					if (newRotationSpeed > 0) newRotationSpeed -= 1;
					newRotationSpeed -= 0.1;
					newRotation += newRotationSpeed;
				}

				//360-0 switch
				if (newRotation >= 360) newRotation -= 360;
				if (newRotation < 0) newRotation += 360;
			} else {
				//setting to 0 if not turning
				if (newRotationSpeed < 0) newRotationSpeed += 0.15;
				if (newRotationSpeed > 0) newRotationSpeed -= 0.15;
				newRotation += newRotationSpeed / 4;

				let diff;
				for (let i = 0; i < rotation_snappy.length; i++) {
					if (
						newRotation >= rotation_snappy[i] - rotation_max_to_span &&
						newRotation <= rotation_snappy[i] + rotation_max_to_span
					) {
						diff = newRotation - rotation_snappy[i];
						newRotation -= diff / 8;
					}
				}

				//normalize to 0
				if (newRotationSpeed <= 0.2 && newRotationSpeed >= -0.2)
					newRotationSpeed = 0;
			}

			if (keyState.ArrowUp || keyState.ArrowDown) {
				if (keyState.ArrowUp) {
					newSpeed += 0.1;
					if (newSpeed >= boatInfo.boat.speed.max) {
						newSpeed = boatInfo.boat.speed.max;
					}
				} else if (keyState.ArrowDown) {
					if (newSpeed > 0) newSpeed -= 0.1;
					newSpeed -= 0.05;
					if (newSpeed <= -boatInfo.boat.speed.max) {
						newSpeed = -boatInfo.boat.speed.max;
					}
				}
			} else {
				if (newSpeed < 0) newSpeed += 0.05;
				if (newSpeed > 0) newSpeed -= 0.05;

				if (newSpeed < 0.5 && newSpeed > -0.5) newSpeed = 0;
			}

			newX += Math.sin((newRotation * Math.PI) / 180) * newSpeed;
			newY -= Math.cos((newRotation * Math.PI) / 180) * newSpeed;

			setBoatInfo({
				...boatInfo,
				x: newX,
				y: newY,
				boat: {
					...boatInfo.boat,
					rotation: newRotation,
				},
			});

			setSpeed(newSpeed);
			setRotationSpeed(newRotationSpeed);

			// Snap newRotation to the nearest multiple of 90 if it's close
			if (Math.abs(newRotation - 90) < rotationThreshold) {
				newRotation = 90;
			} else if (Math.abs(newRotation - 180) < rotationThreshold) {
				newRotation = 180;
			} else if (Math.abs(newRotation - 270) < rotationThreshold) {
				newRotation = 270;
			} else if (Math.abs(newRotation - 360) < rotationThreshold) {
				newRotation = 0;
			}

			// Snap newSpeed to 0 if it's close
			if (Math.abs(newSpeed) < speedThreshold) {
				newSpeed = 0;
			}
		};

		const handleKeyDown = (event) => {
			if (!keyState[event.key]) {
				setKeyState((prevState) => ({
					...prevState,
					[event.key]: true,
				}));

				if (latestMultiplayerCheck + 10000 < Date.now()) {
					let res = getClosestPlayers();
					if (res) {
						console.log(`CLOSEST PLAYERS: `);
						console.log(res);
						createPlayerMultiplayer(access_token, boatInfo);
					}
					multiplayerCheck(Date.now());
				}
			}
		};

		const handleKeyUp = (event) => {
			setKeyState((prevState) => ({
				...prevState,
				[event.key]: false,
			}));
		};

		const interval = setInterval(handleKeyPress, 1000 / 60);

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			clearInterval(interval);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [keyState, boatInfo, speed, rotationSpeed]);

	//MARK: HTML
	return (
		<div
			id="background-g"
			className="absolute top-0 left-0 flex items-center justify-center w-full h-full"
		>
			<img
				src="boat.png"
				alt="boat"
				className="w-10"
				style={{
					position: "absolute",
					left: `calc(50% - 5px)`,
					top: `calc(50% - 5px)`,
					imageRendering: "pixelated",
					transform: `rotate(${boatInfo.boat.rotation}deg)`,
				}}
			/>
			<div className="absolute top-0 right-0 p-4">
				<h3 className="text-white">Boat Information</h3>
				<p className="text-white">X: {boatInfo.x.toFixed(1)}</p>
				<p className="text-white">Y: {boatInfo.y.toFixed(1)}</p>
				<p className="text-white">
					Rotation: {boatInfo.boat.rotation.toFixed(1)}
				</p>
				<p className="text-white">Speed: {speed.toFixed(1)}</p>
			</div>
			<WaterBackground
				canvasSize={canvasSize}
				player_x={boatInfo.x}
				player_y={boatInfo.y}
			/>
		</div>
	);
}

export default Game;
