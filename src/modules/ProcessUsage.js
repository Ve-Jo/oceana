const asciichart = require("asciichart");
let current_ram_usage = new Array(50).fill(0);

module.exports = async function (client) {
	setInterval(() => {
		const delta_memory = getMemoryDifference();
		if (Math.abs(delta_memory) > 1) {
			console.log("RAM usage has changed.");
			console.log(`Delta Memory: ${delta_memory} MB`);
			console.log(
				asciichart.plot([current_ram_usage], {
					height: 10,
					colors: [asciichart.blue],
				})
			);
		}
	}, 1000);
};

function getMemoryDifference() {
	current_ram_usage.shift();
	const newRamUsage = process.memoryUsage().heapUsed / 1024 / 1024;
	const delta_memory =
		newRamUsage - (current_ram_usage[current_ram_usage.length - 1] || 0);

	current_ram_usage.push(newRamUsage);
	return delta_memory;
}
