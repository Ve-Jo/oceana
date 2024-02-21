const asciichart = require("asciichart");
const os = require("os-utils");

let current_ram_usage = new Array(50).fill(0);
let current_cpu_usage = new Array(50).fill(0);

module.exports = async function (client) {
	setInterval(() => {
		current_cpu_usage.shift();
		os.cpuUsage((v) => {
			current_cpu_usage.push(v);
		});

		current_ram_usage.shift();
		current_ram_usage.push(process.memoryUsage().heapUsed / 1024 / 1024);

		console.clear();
		console.log(
			asciichart.plot([current_ram_usage, current_cpu_usage], {
				height: 20,
				colors: [asciichart.blue, asciichart.red],
			})
		);
	}, 1000);
};
