const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs')

console.time('nodeHtmlToImage')

nodeHtmlToImage({
  type: "jpeg",
  quality: 50,
  content: {
    test: "Yakov",
  },
  puppeteerArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
  html: fs.readFileSync("./test.html", "utf8"),
})
  .then(() => {
    console.timeEnd("nodeHtmlToImage");
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });