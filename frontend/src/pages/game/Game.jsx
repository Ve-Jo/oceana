import React, { useEffect, useState, useRef } from "react";
import "./Game.css";

import WindowResize from "../../components/WindowResize";
import BoatInfo from "../../components/BoatInfo";
import GameKeyboardControls from "../../components/GameKeyboardControls";
import WaterBackgroundChunk from "../../components/WaterBackgroundChunk";
import PerlinNoiseCanvas from "../../components/WaterBackgroundNoise";
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

	/*<PerlinNoiseCanvas screenSize={screenSize} />*/

	/*
	<WaterBackgroundChunk
				screen={{ screenSize, setScreenSize }}
				boatInfo={{ boatInfo, setBoatInfo }}
				savedBackgroundChunks={{
					savedBackgroundChunks,
					setSavedBackgroundChunks,
				}}
				currentPlayerChunkId={{
					currentPlayerChunkId,
					setCurrentPlayerChunkId,
				}}
				className="absolute top-0 left-0 z-index-[-1]"
			/>*/

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
						zIndex: 30,
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
						zIndex: 30,
					}}
				/>
			</div>
			<div className="absolute top-0 right-0 p-4 z-30">
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
			<div className="relative w-full h-full z-0">
				<div className="absolute top-0 left-0 w-full h-full z-0">
					<WaterBackgroundChunk
						screen={{ screenSize, setScreenSize }}
						boatInfo={{ boatInfo, setBoatInfo }}
						savedBackgroundChunks={{
							savedBackgroundChunks,
							setSavedBackgroundChunks,
						}}
						currentPlayerChunkId={{
							currentPlayerChunkId,
							setCurrentPlayerChunkId,
						}}
					/>
				</div>
				<div className="absolute top-0 left-0 w-full h-full z-0">
					<PerlinNoiseCanvas screenSize={screenSize} boatInfo={boatInfo} />
				</div>
			</div>
		</div>
	);
}

export default Game;
