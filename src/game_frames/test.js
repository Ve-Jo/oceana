import { ButtonBuilder, AttachmentBuilder, ActionRowBuilder } from "discord.js";
import User from "./../models/UserModel.js";
import Boat from "./../models/BoatModel.js";
import World from "./../models/WorldModel.js";
import Upgrades from "./../models/UpgradesModel.js";
import Test, {
	ImagesPrerender,
	UIRender,
} from "./../htmls/game/canvas/test.js";

export default async (client, interaction, collector) => {
	let user;
	if (await User.exists({ id: interaction.user.id })) {
		user = await User.findOne({ id: interaction.user.id });
	} else {
		user = await User.create({ id: interaction.user.id });
		await user.save();
		let models = [Boat, World, Upgrades];
		for (let model of models) {
			let document = await model.findOneAndUpdate(
				{ [`${model.modelName.toLowerCase()}_for_id`]: interaction.user.id },
				{ upsert: true, new: true }
			);
			if (!document) {
				document = await model.create({
					[`${model.modelName.toLowerCase()}_for_id`]: interaction.user.id,
				});
			}
			console.log(model.modelName);
			user[`${model.modelName.toLowerCase()}`] = document._id;
		}
		await user.save();
	}

	user.ui_updated = 1;

	let ui_canvas;
	let all_prerendered;

	async function update() {
		console.time("entire update");
		console.time("image prerender");
		all_prerendered = await ImagesPrerender({ interaction });
		console.timeEnd("image prerender");
		console.time("ui render");
		ui_canvas = await UIRender({ user, ctx_ui: ui_canvas, all_prerendered });
		console.timeEnd("ui render");
		console.time("canvas render");
		let result = await Test({ user, ui_canvas, all_prerendered });
		console.timeEnd("canvas render");
		console.time("attachment creation");
		const attachment = new AttachmentBuilder(result, {
			name: "screenshot.png",
		});
		console.timeEnd("attachment creation");
		console.time("message building and sending");

		let control_buttons = [
			["↖️", "⬆️", "↗️"],
			["↗️", "▶️", "↘️"],
			["↘️", "⬇️", "↙️"],
			["↙️", "◀️", "↗️"],
		];

		let control_ready = Math.floor(user.boat.rotation / 90);

		const controls = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("game_rotateleft")
				.setEmoji(control_buttons[control_ready][0])
				.setStyle(1),
			new ButtonBuilder()
				.setCustomId("game_forward")
				.setEmoji(control_buttons[control_ready][1])
				.setStyle(1),
			new ButtonBuilder()
				.setCustomId("game_rotateright")
				.setEmoji(control_buttons[control_ready][2])
				.setStyle(1),
		]);

		await interaction.editReply({
			content: "",
			embeds: [],
			files: [attachment],
			components: [controls],
			ephemeral: false,
		});
		console.timeEnd("message building and sending");
		console.timeEnd("entire update");
	}
	await update();

	async function move_boat_forward() {
		let angleInRadians = ((user.boat.rotation + 90) * Math.PI) / 180;
		let distance = 80;
		let deltaX = distance * Math.cos(angleInRadians);
		let deltaY = distance * Math.sin(angleInRadians);
		user.x += deltaX;
		user.y += deltaY;
	}

	collector.on("collect", async (button) => {
		if (button.customId === "game_rotateleft") {
			user.boat.rotation -= 25;
			if (user.boat.rotation <= 0) {
				user.boat.rotation += 360;
			}
			if (user.boat.speed.current >= 10) {
				user.boat.speed.current -= 10;
			}
			await move_boat_forward();
		}
		if (button.customId === "game_forward") {
			if (user.boat.speed.current < user.boat.speed.max) {
				user.boat.speed.current += 20;
			}
			await move_boat_forward();
		}
		if (button.customId === "game_rotateright") {
			user.boat.rotation += 25;
			if (user.boat.rotation >= 360) {
				user.boat.rotation -= 360;
			}
			if (user.boat.speed.current >= 10) {
				user.boat.speed.current -= 10;
			}
			await move_boat_forward();
		}
		await update();
		await button.deferUpdate();
	});
};
