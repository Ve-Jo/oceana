import User from "../models/UserModel.js";
import Boat from "../models/BoatModel.js";
import World from "../models/WorldModel.js";
import Upgrades from "../models/UpgradesModel.js";
import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("register")
		.setDescription(
			"Команда для первой регистрации пользователя в базе данных."
		),
	async execute({ client, interaction }) {
		return;
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
