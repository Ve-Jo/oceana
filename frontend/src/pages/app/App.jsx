import React, { useState, useEffect } from "react";
import Menu from "../menu/Menu.jsx";
import setupDiscordSdk from "../../modules/setupDiscordSdk.js";

function App() {
	const [access_token, setAccessToken] = useState(null);

	useEffect(() => {
		async function initialize() {
			try {
				// Setup Discord SDK and retrieve access_token
				const token = await setupDiscordSdk();
				setAccessToken(token);
				console.log("setup success");
				console.log(access_token);
			} catch (error) {
				console.error("Error during initialization:", error);
			}
		}

		initialize();
	}, []);
	// Render the Menu component only when access_token is available
	return access_token ? (
		<Menu setCurrentPage={setCurrentPage} access_token={access_token} />
	) : null;
}

export default App;
