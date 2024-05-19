import React from "react";

export default function BoatInfo(access_token) {
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

	return React.useEffect(() => {
		const fetchBoatInfo = async () => {
			try {
				const response = await fetch(`/api/users/${access_token.user.id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch boat information");
				}
				const data = await response.json();
				if (data) {
					/*setBoatInfo(data);*/
					await createPlayerMultiplayer(access_token, data);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchBoatInfo();
	}, []);
}
