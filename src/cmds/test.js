import {
	ActionRowBuilder,
	ButtonBuilder,
	SlashCommandBuilder,
	AttachmentBuilder,
} from "discord.js";
import User from "./../models/UserModel.js";
import Boat from "./../models/BoatModel.js";
import World from "./../models/WorldModel.js";
import Upgrades from "./../models/UpgradesModel.js";
import game_collector from "../game_frames/collectors/game_collector.js";

export default {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Тестовая команда управления кораблём"),
	async execute({ client, interaction }) {
		await interaction.deferReply();

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

		console.log(user);

		await client.browser.createPage(interaction.user.id, "./game/test.html");

		async function update() {
			console.time("browser");
			console.log(user.x, user.y, user.boat.rotation);

			await client.browser.changePage(interaction.user.id, {
				"rotation_line.css.rotate": `${180 - user.boat.rotation}deg`,
			});

			for (let i = 0; i < user.world.staff.length; i++) {
				const staff = user.world.staff[i];
				if (
					!(await client.browser.elementExists(
						`${interaction.user.id}`,
						`fish-${staff.id}`
					))
				) {
					await client.browser.createElement(
						`${interaction.user.id}`,
						`all_objects`,
						`fish-${staff.id}`,
						"img"
					);
				}

				const fishOffsetX =
					(user.x - staff.x) * Math.cos((-user.boat.rotation * Math.PI) / 180) -
					(user.y - staff.y) * Math.sin((-user.boat.rotation * Math.PI) / 180);
				const fishOffsetY =
					(user.x - staff.x) * Math.sin((-user.boat.rotation * Math.PI) / 180) +
					(user.y - staff.y) * Math.cos((-user.boat.rotation * Math.PI) / 180);

				await client.browser.changePage(interaction.user.id, {
					[`fish-${staff.id}.css.width`]: "50px",
					[`fish-${staff.id}.src`]: "../sources/icons/fish.png",
					[`fish-${staff.id}.css.top`]: fishOffsetY + "px",
					[`fish-${staff.id}.css.left`]: fishOffsetX + "px",
				});
				console.log(
					`DIFFERENCE X: ${user.x - staff.x}; Y: ${user.y - staff.y}`
				);
			}

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

			let buffer = await client.browser.screenshotPage(
				interaction.user.id,
				{ x: 8, y: 8, width: 600, height: 500 },
				100
			);

			const attachment = new AttachmentBuilder(buffer, {
				name: "screenshot.png",
			});

			await interaction.editReply({
				content: "",
				embeds: [],
				files: [attachment],
				components: [controls],
				ephemeral: false,
			});
			console.timeEnd("browser");
		}
		update();
		let collector = await game_collector({ client, interaction });

		collector.on("collect", async (button) => {
			await button.deferUpdate();
			if (button.customId === "game_rotateleft") {
				user.boat.rotation -= 25;
				if (user.boat.rotation <= -360) {
					user.boat.rotation += 360;
				}
			}
			if (button.customId === "game_forward") {
				let angleInRadians = ((user.boat.rotation + 90) * Math.PI) / 180;
				let distance = 50;
				let deltaX = distance * Math.cos(angleInRadians);
				let deltaY = distance * Math.sin(angleInRadians);
				user.x += deltaX;
				user.y += deltaY;
				console.log(`MOVED`);
				console.log(Math.floor(deltaX), Math.floor(deltaY));
			}
			if (button.customId === "game_rotateright") {
				user.boat.rotation += 25;
				if (user.boat.rotation >= 360) {
					user.boat.rotation -= 360;
				}
			}
			update();
		});
	},
};
