/*const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs").promises;

console.time("nodeHtmlToImage");

async function generateImage() {
  try {
    const htmlContent = await fs.readFile("./test.html", "utf8");

    await nodeHtmlToImage({
      type: "jpeg",
      quality: 50,
      content: {
        test: "Yakov",
      },
      puppeteerArgs: {
        args: ["--no-sandbox"],
      },
      html: htmlContent,
    });

    console.timeEnd("nodeHtmlToImage");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

generateImage();*/

/*const puppeteer = require("puppeteer");
const fs = require("fs").promises;

console.time("puppeteer");

async function generateImage() {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.goto(`file://${__dirname}/test.html`);

    await page.screenshot({
      path: "screenshot.jpg",
      type: "jpeg",
      quality: 50,
    });

    await browser.close();

    console.timeEnd("puppeteer");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

generateImage();*/

const playwright = require("playwright");
const fs = require("fs").promises;



async function generateImage() {
  try {
    console.time("playwright browser");

    const browser = await playwright.chromium.launch({
      headless: true,
      javaScriptEnabled: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.timeEnd("playwright browser");

    console.time("playwright page");

    const page = await browser.newPage();

    await page.goto(`file://${__dirname}/test.html`);

    await page.screenshot({
      path: "screenshot.jpg",
      type: "jpeg",
      quality: 50,
    });

    await browser.close();

    console.timeEnd("playwright page");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

generateImage();
