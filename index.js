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

const puppeteer = require("puppeteer");
const fs = require("fs").promises;

console.time("puppeteer");

async function generateImage() {
  try {
    const htmlContent = await fs.readFile("./test.html", "utf8");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent);

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

generateImage();
