// и так смотри, короче всё работает пиздато почти но есть нюанс которые ты сам заметишь надеюсь, и еще сделать под ему спец разрешение чтобы хуета не была, пон?

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Показывает uptime в виде красивой картинки'),
  async execute(client, interaction) {
    // Получение данных о системе
    const uptimeData = {
      uptime: process.uptime(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      loadavg: os.loadavg(),
      cpus: os.cpus(),
      // другие данные
    };

    // Загрузка и модификация HTML-шаблона
    let html = fs.readFileSync("src/htmls/uptime_template.html", "utf8");

    // Заполнение шаблона данными о системе
    // (реализуй здесь логику подстановки данных в html)

    // Создание страницы и скриншот
    await client.browser.createPage(interaction.user.id);
    let buffer = await client.browser.screenshotPage(
      interaction.user.id,
      html // передаем измененный HTML с данными о системе
    );
    await client.browser.closePage(interaction.user.id);

    // Отправка картинки в ответ на команду
    await interaction.reply({ files: [buffer] });
  },
};
