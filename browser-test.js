const playwright = require("playwright");
const fs = require("fs").promises;
const { JSDOM } = require("jsdom");

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
    await page.goto("file://" + __dirname + "/test.html")

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
