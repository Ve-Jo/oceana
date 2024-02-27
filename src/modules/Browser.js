import { chromium } from "playwright";
import path from "path";
import { JSDOM } from "jsdom";
import fs from "fs";
const pages = {
	//user-id: { file_name: name, page: page }
};
let browser = false;

const html_path = path.resolve(import.meta.dir, "../htmls");

export default function (client) {
	client.browser = {
		createPage,
		screenshotPage,
		changePage,
		closePage,
		status: () => {
			return browser !== false;
		},
	};
	console.log("Browser module is loaded");
}

async function startBrowser() {
	try {
		console.time("browser start");
		browser = await chromium.launch({
			headless: process.env.BROWSER_HEADLESS == "true" ? true : false,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		console.timeEnd("browser start");
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function changePage(userid, html = {}, without_temp = false) {
	if (!pages[userid]) return;
	const page = pages[userid];
	const temp_html = new JSDOM(
		fs.readFileSync(`src/htmls/${page.file_name}`, "utf8")
	);

	for (const [key, value] of Object.entries(html)) {
		const [id, attr, css] = key.split(".");
		const el = temp_html.window.document.getElementById(id);
		if (!el) continue;
		if (!attr) {
			el.textContent = value;
			continue;
		}

		if (attr == "css") {
			el.style[css] = value;
		} else {
			el.setAttribute(attr, value);
		}
	}
	let temp_folder = without_temp
		? `${page.file_name.replace(".html", "")}`
		: `temp/${userid}`;
	if (without_temp == false && !fs.existsSync(`./src/htmls/temp`)) {
		fs.mkdirSync(`./src/htmls/temp`);
	}
	fs.writeFileSync(`./src/htmls/${temp_folder}.html`, temp_html.serialize());
	page.file_name = `${temp_folder}.html`;
	await page.page.goto(`file://` + html_path + "/" + page.file_name);
	await page.page.waitForLoadState("domcontentloaded");
}

async function createPage(userid, html_name) {
	if (browser == false) await startBrowser();
	try {
		let page_link = `file://${path.join(html_path, html_name)}`;
		let current_page =
			pages[userid]?.page || (await browser.newPage({ deviceScaleFactor: 2 }));
		await current_page.goto(page_link);
		await current_page.waitForLoadState("domcontentloaded");
		pages[userid] = { file_name: html_name, page: current_page };
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
			width: clip.width * 1.5,
			height: clip.height * 1.5,
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
		if (page !== undefined && page.page) {
			await page.page.close();
			if (page.file_name.startsWith("temp/")) {
				let delete_path = `./src/htmls/${page.file_name}`;
				if (fs.existsSync(delete_path)) {
					fs.unlinkSync(delete_path);
				}
			}
			delete pages[userid];
		} else {
			console.log("Page does not exist for userId: " + userid);
		}
		if (!Object.keys(pages).length) {
			await browser.close();
			browser = false;
		}
	} catch (error) {
		console.error("An error occurred:", error);
	}
}
