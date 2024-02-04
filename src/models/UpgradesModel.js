const mongoose = require("mongoose");

const UpgradesModel = new mongoose.model("Upgrades", {
	world: {
		fishes_chance_level: Number,
		fishes_value_level: Number,
		less_enemies_level: Number,
		xp_multiplier_level: Number,
		more_threasures_level: Number,
	},
	boat: {
		max_speed: Number,
		rotation_speed: Number,
		rod_distance_level: Number,
		rod_durability_level: Number,
		rods_counter: Number,
		guns_level: Number,
		guns_counter: Number,
		cargo_level: Number,
		health_level: Number,
	},
	user: {
		energy_max_level: Number,
		visibility_level: Number,
		visibility_in_fog_level: Number,
	},
	skills: {
		islands_outside_map_level: Number,
		enemies_outside_map_level: Number,
		fast_boat_rotate_level: Number,
		catch_all_fish_level: Number,
		catch_double_fish_level: Number,
	},
});

const Upgrades = mongoose.model("Upgrades", UpgradesModel);

module.exports = Upgrades;
