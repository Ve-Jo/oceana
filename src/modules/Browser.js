const { chromium } = require("playwright");
const path = require("path");
const { JSDOM } = require("jsdom");
const fs = require("fs");
const pages = {
	//user-id: { file_name: name, page: page }
};
let browser = false;

const html_path = path.resolve(import.meta.dir, "../html");

module.exports = function (client) {
	client.browser = {
		createPage,
		screenshotPage,
		changePage,
		closePage,
	};
};

async function startBrowser() {
	try {
		console.time("browser start");
		browser = await chromium.launch({
			headless: false,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		console.timeEnd("browser start");
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function changePage(userid, html = {}) {
	if (!pages[userid]) return;
	const page = pages[userid];
	const temp_html = new JSDOM(
		fs.readFileSync("file://" + html_path + "/" + page.file_name, "utf8")
	);
	//for example, my html will be
	//{ "user_avatar.src": "link" }
	for (const key in html) {
		const [element, attribute] = key.split(".");
		temp_html.window.document
			.querySelector(element)
			.setAttribute(attribute, html[key]);
	}
	fs.writeFileSync(`src/htmls/temp/${userid}.html`, temp_html.serialize());
	page.file_name = `temp/${userid}.html`;
	await page.page.goto(`file://` + html_path + "/" + page.file_name);
	await page.page.waitForLoadState("domcontentloaded");
}

async function createPage(userid, html_name) {
	if (browser == false) await startBrowser();
	try {
		if (pages[userid] && pages[userid].file_name != html_name) {
			await pages[userid].page.close();
			delete pages[userid];
		}
		if (!pages[userid]) {
			const page = await browser.newPage();
			await page.goto(`file://${path.join(html_path, html_name)}`);
			await page.waitForLoadState("domcontentloaded");
			pages[userid] = { file_name: html_name, page: page };
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function screenshotPage(
	userid,
	clip = { x: 0, y: 0, width: 600, height: 600 },
	quality = 50
) {
	try {
		if (!pages[userid]) return;
		console.time("page screenshot");
		const page = pages[userid].page;
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
		if (fs.fileExistsSync(`src/htmls/temp/${userid}.html`)) {
			fs.unlinkSync(`src/htmls/temp/${userid}.html`);
		}
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
