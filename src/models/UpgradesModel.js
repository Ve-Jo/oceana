const mongoose = require("mongoose");

const UpgradesModel = new mongoose.model("Upgrades", {
	world: {
		fishes_chance_level: { Number, default: 1 },
		fishes_value_level: { Number, default: 1 },
		less_enemies_level: { Number, default: 1 },
		xp_multiplier_level: { Number, default: 1 },
		more_threasures_level: { Number, default: 1 },
	},
	boat: {
		max_speed: { Number, default: 1 },
		rotation_speed: { Number, default: 1 },
		rod_distance_level: { Number, default: 1 },
		rod_durability_level: { Number, default: 1 },
		rods_counter: { Number, default: 1 },
		guns_level: { Number, default: 1 },
		guns_counter: { Number, default: 0 },
		cargo_level: { Number, default: 1 },
		health_level: { Number, default: 1 },
	},
	user: {
		energy_max_level: { Number, default: 1 },
		visibility_level: { Number, default: 1 },
		visibility_in_fog_level: { Number, default: 1 },
	},
	skills: {
		islands_outside_map_level: { Number, default: 0 },
		enemies_outside_map_level: { Number, default: 0 },
		fast_boat_rotate_level: { Number, default: 0 },
		catch_all_fish_level: { Number, default: 0 },
		catch_double_fish_level: { Number, default: 0 },
	},
});

const Upgrades = mongoose.model("Upgrades", UpgradesModel);

module.exports = Upgrades;
