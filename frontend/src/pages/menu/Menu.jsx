import React from "react";
import "./Menu.css";

function Menu({ setCurrentPage, access_token }) {
	const handlePageChange = (page) => {
		setCurrentPage(page); // Update currentPage state in App component
	};

	if (!access_token) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div id="background" className="absolute w-[100%] h-[100%]"></div>
			<div className="grid max-h-screen grid-cols-3 overflow-hidden sm:grid-rows-8 grid-rows-10">
				<div
					id="about_user"
					className="relative flex flex-row items-center col-span-2 row-span-4 text-xl text-white p-14 sm:p-5 sm:row-span-2 fade-in"
				>
					<img
						id="useravatar"
						alt="User"
						src={
							access_token.user.avatar
								? `https://cdn.discordapp.com/avatars/${access_token.user.id}/${access_token.user.avatar}.webp?size=1024`
								: "./../public/discord_avatar.png"
						}
						className="rounded-[35%] h-[10vw] w-[10vw] sm:scale-100 scale-[200%] fade-in sm:transition-all sm:duration-300 sm:transform sm:hover:scale-110"
					/>
					<p id="hello" className="mx-10 text-3xl text-left sm:mx-3 fade-in">
						{access_token && `👋 Привет, ${access_token.user.username}!`}
					</p>
				</div>
				<div
					id="discord_logo"
					className="relative flex justify-end p-5 fade-in"
				>
					<img
						id="Discord"
						alt="Discord"
						src="./../public/discord_avatar.png"
						className="sm:h-[10vw] h-[20vw] transition-all duration-300 fade-in hover:rotate-12 hover:scale-110"
					/>
				</div>
				<div id="logo" className="relative col-span-3 row-span-2">
					<h1 className="font-semibold text-center text-white text-8xl">
						Oceana
					</h1>
				</div>
				<div id="uptime" className="relative col-start-2 row-span-2">
					<p className="rounded-lg text-white sm:-my-5 -my-10 font-bold p-0.5 fade-in">
						🟢 1h 20m 30s
					</p>
				</div>
				<div
					id="buttons"
					className="relative flex items-center justify-center col-start-2"
				>
					<button
						id="play"
						disabled={!access_token}
						className="p-5 -my-5 text-4xl font-bold text-white transition-all duration-300 transform bg-blue-500 hover:bg-blue-800 rounded-cool sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl hover:scale-110"
						onClick={() => handlePageChange("game")}
					>
						Играть
					</button>
				</div>
			</div>
		</>
	);

	/*
	return (
		<div className="relative flex flex-col h-screen gap-4">
			<div id="background" className="absolute w-full"></div>
			<div
				id="about_user "
				className="absolute flex items-center col-span-2 row-span-1 p-5 text-3xl text-white fade-in"
			>
				<img
					id="useravatar"
					alt="User"
					src={
						access_token.user.avatar
							? `https://cdn.discordapp.com/avatars/${access_token.user.id}/${access_token.user.avatar}.webp?size=1024`
							: "./../public/discord_avatar.png"
					}
					className="rounded-cool h-[10vw] w-[10vw] fade-in transition-all duration-300 transform hover:scale-110"
				/>
				<p
					id="hello"
					className="mx-2 text-3xl fade-in sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
				>
					{access_token && `👋 Привет, ${access_token.user.username}!`}
				</p>
			</div>

			<img
				id="Discord"
				alt="Discord"
				src="./../public/discord_avatar.png"
				className="rounded-full absolute right-8 top-3 h-[12vw] fade-in transition-all duration-300 hover:rotate-12 hover:scale-110"
			/>

			<div className="absolute my-16 transform -translate-x-1/2 -translate-y-1/2 top-1/4 left-1/2">
				<p className="fixed text-[8vw] sm:text-6vw md:text-7vw lg:text-8vw xl:text-9vw 2xl:text-10vw left-[50%] rotate-12 fade-in">
					🎣
				</p>
				<h1 className="relative text-[15vw] sm:text-9vw md:text-10vw lg:text-11vw xl:text-12vw 2xl:text-13vw font-semibold text-white text-center top-0">
					Oceana
				</h1>
				<p className="fixed bg-white rounded-lg mx-2 -my-7 text-[2vw] sm:text-[2.2vw] md:text-[2.5vw] lg:text-[3vw] xl:text-[3.5vw] 2xl:text-[4vw] font-bold p-0.5 fade-in transition-all duration-300 transform hover:scale-90">
					🟢 1h 20m 30s
				</p>
			</div>
			<div className="relative col-span-3 -my-5 text-center top-3/4 fade-in">
				<button
					id="play"
					disabled={!access_token}
					className="bg-blue-500 hover:bg-blue-800 text-white font-bold p-[4vw] py-[3vw] rounded-cool text-[4vw] sm:text-[4vw] md:text-[5vw] lg:text-[6vw] xl:text-[7vw] 2xl:text-[8vw] text-4xl transition-all duration-300 transform hover:scale-110"
					onClick={() => handlePageChange("game")}
				>
					Играть
				</button>
			</div>
		</div>
	);
	*/
}

export default Menu;
