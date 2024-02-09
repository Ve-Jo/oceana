const fs = require('fs')

module.exports = function () {
    const temp_htmls = fs.readdirSync("src/htmls/temp");
    for (const file of temp_htmls) {
        fs.unlinkSync(`src/htmls/temp/${file}`);
    }
}