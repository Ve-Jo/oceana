import React, { useState, useEffect } from "react";
import Menu from "../menu/Menu.jsx";
import setupDiscordSdk from "../../modules/setupDiscordSdk.js";
import Game from "../game/Game.jsx";

function App() {
	const [access_token, setAccessToken] = useState(null);
	const [currentPage, setCurrentPage] = useState("menu");

	useEffect(() => {
		async function initialize() {
			try {
				const token = await setupDiscordSdk();
				console.log(`getting token: ${JSON.stringify(token)}`);
				setAccessToken(token);
			} catch (error) {
				console.error("Error during initialization:", error);
			}
		}
		initialize();
	}, []);

	return (
		<React.Fragment>
			{currentPage === "menu" && (
				<Menu setCurrentPage={setCurrentPage} access_token={access_token} />
			)}
			{currentPage === "game" && (
				<Game setCurrentPage={setCurrentPage} access_token={access_token} />
			)}
		</React.Fragment>
	);
}

export default App;
