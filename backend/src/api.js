import express from "express";
import fetch from "node-fetch";

export default {
	async execute(app, port) {
		const router = express.Router();

		router.post("/token", async (req, res) => {
			console.log("catching request", req.body.code);
			const response = await fetch(`https://discord.com/api/oauth2/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
					client_secret: import.meta.env.DISCORD_CLIENT_SECRET,
					grant_type: "authorization_code",
					code: req.body.code,
				}),
			});

			const { access_token } = await response.json();
			res.send({ access_token });
		});

		app.use("/api", router);

		app.listen(port, () => {
			console.log(`Server listening at http://localhost:${port}`);
		});
	},
};
