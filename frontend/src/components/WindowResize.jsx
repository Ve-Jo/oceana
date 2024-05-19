import React from "react";

export default function WindowResize({ screenSize, setScreenSize }) {
	return React.useEffect(() => {
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
}
