const { chromium } = require("playwright");
const { resolve } = require("path");
const pages = {
	//user-id: //page
};
let browser = false;

module.exports = function (client) {
	client.browser = {
		createPage,
		screenshotPage,
		closePage,
	};
};

async function startBrowser() {
	try {
		console.time("browser start");
		browser = await chromium.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		browser_started = true;
		console.timeEnd("browser start");
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function createPage(userid) {
	if (browser == false) await startBrowser();
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
	html_path,
	clip = { x: 0, y: 0, width: 600, height: 600 },
	quality = 50
) {
	try {
		console.time("page screenshot");
		const page = pages[userid];
		await page.goto(
			`file://` + resolve(import.meta.dir, "../../", "src/htmls", html_path)
		);
		await page.setViewportSize({
			width: clip.width,
			height: clip.height,
		});
		let buffer = await page.screenshot({
			type: "jpeg",
			quality: quality,
			clip: clip,
		});
		console.timeEnd("page screenshot");
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
			browser = false;
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}
