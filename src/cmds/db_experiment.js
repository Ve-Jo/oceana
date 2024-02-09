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
		await interaction.deferReply();

		/*const user = new User({ id: interaction.user.id });

		const boat = new Boat();
		await boat.save();
		user.boat = boat._id;

		const world = new World();
		await world.save();
		user.world = world._id;

		const upgrades = new Upgrades();
		await upgrades.save();
		user.upgrades = upgrades._id;

		await user.save();*/

		const user = await User.findOne({ id: interaction.user.id });
		console.log(user);

		//EXAMPLES:
		//user.money = 50; user.save();
		//user.boat.xp.current = 50; user.boat.save();
		//user.world.xp = 50; user.world.save();
		//user.upgrades.world.fishes_chance_level++; user.upgrades.save();
	},
};
