import { I18n } from "i18n";

export default function (client) {
	client.i18n = new I18n({
		locales: ["en", "ru", "uk"],
		directory: "./src/locales",
		register: global,
		objectNotation: true,
	});
	console.log("Localizator is ready");
}
