const mongoose = require("mongoose");

const UpgradesSchema = new mongoose.Schema({
	upgrades_for_id: {
		type: Number,
		required: true,
		unique: true,
	},
	world: {
		fishes_chance_level: { type: Number, default: 1 },
		fishes_value_level: { type: Number, default: 1 },
		less_enemies_level: { type: Number, default: 1 },
		xp_multiplier_level: { type: Number, default: 1 },
		more_threasures_level: { type: Number, default: 1 },
	},
	boat: {
		max_speed: { type: Number, default: 1 },
		rotation_speed: { type: Number, default: 1 },
		rod_distance_level: { type: Number, default: 1 },
		rod_durability_level: { type: Number, default: 1 },
		rods_counter: { type: Number, default: 1 },
		/*guns_level: { type: Number, default: 1 },
		guns_counter: { type: Number, default: 0 },
		cargo_level: { type: Number, default: 1 },*/
		health_level: { type: Number, default: 1 },
	},
	user: {
		energy_max_level: { type: Number, default: 1 },
		visibility_level: { type: Number, default: 1 },
		visibility_in_fog_level: { type: Number, default: 1 },
	},
	skills: {
		islands_outside_map_level: { type: Number, default: 0 },
		enemies_outside_map_level: { type: Number, default: 0 },
		fast_boat_rotate_level: { type: Number, default: 0 },
		catch_all_fish_level: { type: Number, default: 0 },
		catch_double_fish_level: { type: Number, default: 0 },
	},
});

const Upgrades = mongoose.model("Upgrades", UpgradesSchema);

module.exports = Upgrades;
