import React from "react";

export default function GameKeyboardControls({
	boatInfo: { boatInfo, setBoatInfo },
	speed: { speed, setSpeed },
	rotationSpeed: { rotationSpeed, setRotationSpeed },
	leftNotificationsPlacement: {
		leftNotificationsPlacement,
		setLeftNotificationsPlacement,
	},
	keyState: { keyState, setKeyState },
}) {
	return React.useEffect(() => {
		const handleKeyPress = () => {
			let newX = boatInfo.x;
			let newY = boatInfo.y;
			let newRotation = boatInfo.boat.rotation;
			let newSpeed = speed;
			let newRotationSpeed = rotationSpeed;

			let CurrentLeftNotificationsPlacement = leftNotificationsPlacement;

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
				}
				if (keyState.ArrowLeft) {
					if (newRotationSpeed > 0) newRotationSpeed -= 1;
					newRotationSpeed -= 0.1;
					newRotation += newRotationSpeed;
				}

				//360-0 switch
				if (newRotation >= 360) {
					newRotation -= 360;
				} else if (newRotation < 0) {
					newRotation += 360;
				}
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

			newX -= Math.sin((newRotation * Math.PI) / 180) * newSpeed;
			newY += Math.cos((newRotation * Math.PI) / 180) * newSpeed;

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

			const notification_rotations = [0, 45, 90, 135, 180, 225, 270, 315, 360];
			const notification_snappy = [
				{ rotate: 0, x: 15, y: -50 },
				{ rotate: -45, x: -20, y: 15 },
				{ rotate: 0, x: -75, y: 45 },
				{ rotate: 45, x: -135, y: 5 },
				{ rotate: 0, x: -175, y: -55 },
				{ rotate: -45, x: -145, y: -105 },
				{ rotate: 0, x: -75, y: -135 },
				{ rotate: 45, x: -20, y: -115 },
				{ rotate: 0, x: 15, y: -50 },
			];

			for (let i = 0; i < notification_snappy.length; i++) {
				let rotation_difference = newRotation - notification_rotations[i];

				if (Math.abs(rotation_difference) <= 33) {
					let NewLeftNotificationsPlacement = notification_snappy[i];

					let movement_difference =
						Math.abs(
							CurrentLeftNotificationsPlacement.x - notification_snappy[i].x,
						) +
						Math.abs(
							CurrentLeftNotificationsPlacement.y - notification_snappy[i].y,
						);

					if (
						Math.abs(
							NewLeftNotificationsPlacement.rotate -
								CurrentLeftNotificationsPlacement.rotate,
						) < 1
					) {
						CurrentLeftNotificationsPlacement.transparency = 1;
						if (movement_difference <= 10) {
							break;
						}
					}

					let diffX =
						NewLeftNotificationsPlacement.x -
						CurrentLeftNotificationsPlacement.x;
					let diffY =
						NewLeftNotificationsPlacement.y -
						CurrentLeftNotificationsPlacement.y;
					let diff =
						NewLeftNotificationsPlacement.rotate -
						CurrentLeftNotificationsPlacement.rotate;

					CurrentLeftNotificationsPlacement.rotate += diff / 30;
					CurrentLeftNotificationsPlacement.x += diffX / 20;
					CurrentLeftNotificationsPlacement.y += diffY / 20;

					CurrentLeftNotificationsPlacement.transparency = 0.5;

					console.log(
						`NEW ROTATION: (${NewLeftNotificationsPlacement.rotate}) (${CurrentLeftNotificationsPlacement.rotate})`,
					);

					setLeftNotificationsPlacement(CurrentLeftNotificationsPlacement);
					break;
				}
			}

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

				/*if (latestMultiplayerCheck + 10000 < Date.now()) {
                let res = getClosestPlayers();
                if (res) {
                    console.log(`CLOSEST PLAYERS: `);
                    console.log(res);
                    createPlayerMultiplayer(access_token, boatInfo);
                }
                multiplayerCheck(Date.now());
            }*/
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
}
