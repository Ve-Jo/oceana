const { I18n } = require("i18n");

module.exports = function (client) {
	client.i18n = new I18n({
		locales: ["en", "ru", "uk"],
		directory: "./src/locales",
		register: global,
		objectNotation: true,
	});
};
