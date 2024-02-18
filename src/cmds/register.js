const User = require("../models/UserModel");
const Boat = require("../models/BoatModel");
const World = require("../models/WorldModel");
const Upgrades = require("../models/UpgradesModel");
const Fish = require("../models/FishModel");
const Island = require("../models/IslandModel");
const Threasure = require("../models/ThreasureModel");
const WorldDecoration = require("../models/WorldDecorationModel");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription(
			"Команда для первой регистрации пользователя в базе данных."
		),
	async execute(client, interaction) {
		let user = await User.findOneAndUpdate(
			{ id: interaction.user.id },
			{ upsert: true, new: true }
		);
		return console.log(user);
		if (user) {
			return interaction.reply({
				content:
					"Вы уже зарегистрированы в базе данных. Можете сразу запустить команду `/game.`",
				ephemeral: true,
			});
		}
		if (!user) {
			user = await User.create({ id: interaction.user.id });
		}

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

		return interaction.reply({
			content: "Первая регистрация прошла успешно. Теперь вы можете играть.",
			ephemeral: true,
		});

		//EXAMPLES:
		//find_user.money = 50; user.save();
		//find_user.boat.xp.current = 50; user.boat.save();
		//find_user.world.xp = 50; user.world.save();
		//find_user.upgrades.world.fishes_chance_level++; user.upgrades.save();
	},
};
