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
		.setName("db")
		.setDescription("Mongoose database experiment command"),
	async execute(client, interaction) {
		let user = await User.findOneAndUpdate(
			{ id: interaction.user.id },
			{ upsert: true, new: true }
		);
		if (!user) {
			await User.create({ id: interaction.user.id });
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
			user[`${model.modelName.toLowerCase()}`] = document._id;
		}
		await user.save();

		const find_user = await User.findOne({ id: interaction.user.id });
		console.log(find_user);

		//EXAMPLES:
		//find_user.money = 50; user.save();
		//find_user.boat.xp.current = 50; user.boat.save();
		//find_user.world.xp = 50; user.world.save();
		//find_user.upgrades.world.fishes_chance_level++; user.upgrades.save();
	},
};
