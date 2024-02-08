const playwright = require("playwright");
const pages = {
	//user-id: //page
};
let browser = null;

module.exports = function (client) {
	client.browser = {
		createPage,
		screenshotPage,
		closePage,
	};
};

async function startBrowser() {
	try {
		browser = await playwright.chromium.launch({
			headless: false,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function createPage(userid) {
	if (!browser) await startBrowser();
	try {
		if (!pages[userid]) {
			const page = await browser.newPage();
			pages[userid] = page;
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function screenshotPage(
	userid,
	html,
	clip = { x: 0, y: 0, width: 600, height: 600 },
	quality = 50
) {
	try {
		const page = pages[userid];
		await page.setContent(html);
		let buffer = await page.screenshot({
			type: "jpeg",
			quality: quality,
			clip: clip,
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
		if (!Object.keys(pages).length) {
			await browser.close();
			browser = null;
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}
