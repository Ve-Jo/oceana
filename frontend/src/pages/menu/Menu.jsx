import React, { useState, useEffect } from "react";
import "./Menu.css";
import getUserInfo from "../../modules/getUserInfo.js";

function Menu({ setCurrentPage, access_token }) {
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		if (access_token) {
			// Call getUserInfo only if access_token is available
			getUserInfo(access_token)
				.then((userInfo) => {
					setCurrentUser(userInfo);
				})
				.catch((error) => {
					console.error("Error fetching user info:", error);
				});
		} else {
			console.log("access_token is ", access_token);
		}
	}, [access_token]);

	if (!currentUser) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div id="background" className="absolute w-full"></div>
			<img
				id="Discord"
				alt="Discord"
				src="./../public/discord_avatar.png"
				className="rounded-full absolute right-10 top-5 h-[12vw] fade-in transition-all duration-300 hover:rotate-12 hover:scale-110"
			/>
			<div
				id="about_user"
				className="absolute text-white top-5 left-5 text-3xl flex items-center fade-in"
			>
				<img
					id="useravatar"
					alt="User"
					src="./../public/discord_avatar.png"
					className="rounded-cool h-[10vw] w-[10vw] fade-in transition-all duration-300 transform hover:scale-110"
				/>
				<p id="hello" className="mx-2 fade-in">
					{currentUser && `👋 Привет, ${currentUser.username}!`}
				</p>
			</div>
			<div>
				<p className="fixed text-5xl left-[57%] top-32 rotate-12 fade-in">🎣</p>
				<h1 className="relative text-8xl font-semibold text-white text-center top-32">
					Oceana
				</h1>
				<p className="fixed bg-white rounded-lg left-[50%] -mx-40 top-56 font-bold p-0.5 fade-in transition-all duration-300 transform hover:scale-90">
					🟢 1h 20m 30s
				</p>
			</div>
			<div className="relative top-[45vh] text-center fade-in">
				<button
					id="play"
					className="bg-blue-500 hover:bg-blue-800 text-white font-bold p-[4vw] py-[3vw] rounded-cool text-4xl transition-all duration-300 transform hover:scale-110"
					onClick={() => setCurrentPage("game")}
				>
					Играть
				</button>
			</div>
		</>
	);
}

export default Menu;
