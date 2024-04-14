import React, { useEffect } from "react";
import "./Game.css";

function Game({ setCurrentPage, access_token }) {
	useEffect(() => {});
	return (
		<div id="background-g" className="absolute w-full">
			<div
				id="background-g"
				className="absolute flex items-center justify-center w-full h-full"
			>
				<img
					src="boat.png"
					alt="boat"
					className="w-10"
					style={{ imageRendering: "pixelated" }}
				/>
			</div>
		</div>
	);
}

export default Game;
