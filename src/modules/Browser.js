//browser plywright, create it

const playwright = require("playwright");
const pages = {
	//user-id: //page
};
let browser;

module.exports = function (client) {
	client.browser = {
		startBrowser,
		createPage,
		screenshotPage,
		closePage,
	};
};

async function startBrowser() {
	try {
		browser = await playwright.chromium.launch({
			headless: true,
			javaScriptEnabled: false,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function createPage(userid) {
	try {
		if (!pages[userid]) {
			const page = await browser.newPage();
			pages[userid] = page;
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function screenshotPage(userid, html) {
	try {
		const page = pages[userid];
		await page.setContent(html);
		let buffer = await page.screenshot({
			type: "jpeg",
			quality: 50,
		});
		return buffer;
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function closePage(userid) {
	try {
		const page = pages[userid];
		await page.close();
		delete pages[userid];
	} catch (error) {
		console.error("An error occurred:", error);
	}
}
