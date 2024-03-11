import { ButtonBuilder, AttachmentBuilder, ActionRowBuilder } from "discord.js";
import User from "./../models/UserModel.js";
import Boat from "./../models/BoatModel.js";
import World from "./../models/WorldModel.js";
import Upgrades from "./../models/UpgradesModel.js";
import Test from "./../htmls/game/canvas/test.js";

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
		user = await User.findOne({ id: interaction.user.id });
		let world = await World.findOne({ _id: user.world });
		world.staff.push(
			{
				id: user.world.staff.length,
				type: "fish",
				x: 0,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length,
				type: "fish",
				x: 100,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 1,
				type: "fish",
				x: 200,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 2,
				type: "fish",
				x: 300,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 3,
				type: "fish",
				x: 400,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 4,
				type: "fish",
				x: 500,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 5,
				type: "fish",
				x: 600,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 6,
				type: "fish",
				x: 700,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 7,
				type: "fish",
				x: 800,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			},
			{
				id: user.world.staff.length + 8,
				type: "fish",
				x: 900,
				y: 0,
				type: 0,
				rarity: 1,
				price: 2,
			}
		);
		await world.save();
		await user.save();
	}

	async function update() {
		console.time("canvas");
		console.log(user.x, user.y, user.boat.rotation);

		let result = await Test(user);
		const attachment = new AttachmentBuilder(result, {
			name: "screenshot.png",
		});

		const controls = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setCustomId("game_rotateleft")
				.setEmoji("↖️")
				.setStyle(1),
			new ButtonBuilder()
				.setCustomId("game_forward")
				.setEmoji("⬆️")
				.setStyle(1),
			new ButtonBuilder()
				.setCustomId("game_rotateright")
				.setEmoji("↗️")
				.setStyle(1),
		]);

		await interaction.editReply({
			content: "",
			embeds: [],
			files: [attachment],
			components: [controls],
			ephemeral: false,
		});
		console.timeEnd("canvas");
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
