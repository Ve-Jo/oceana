import { I18n } from "i18n";

let i18n;

export default function (client) {
	i18n = new I18n({
		locales: ["en", "ru", "uk"],
		directory: "./src/locales",
		register: global,
		objectNotation: true,
		fallbacks: {
			en: ["en-*", "en"],
		},
		defaultLocale: "ru",
		retryInDefaultLocale: true,
	});
	client.i18n = i18n;
	console.log("Localizator is ready");
}

export { i18n };
