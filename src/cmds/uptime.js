// короче смотри, у меня есть идея сделать uptime в виде html-картинки, что скажешь а пока что ебну говна на node:os (кстати он работает и на bun мур, можешь и на своей библией сделать), сделаешь фикс с interaction.reply is not a function. (In 'interaction.reply({ embeds: [embed] })', 'interaction.reply' is undefined)
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Показывает информацию о системе и использовании ресурсов'),
    async execute(interaction) {
        const totalmem = os.totalmem();
        const freemem = os.freemem();
        const usedmem = totalmem - freemem;
        const uptime = process.uptime();
        const loadavg = os.loadavg();
        const cpus = os.cpus();
        
        const embed = new EmbedBuilder()
            .setTitle('Информация о системе и использовании ресурсов')
            .addFields
            (
                { name: '\`⌚️\` Uptime:', value: ` \`\`\`${Math.floor(uptime / 3600)} h ${Math.floor(uptime % 3600 / 60)} m ${Math.floor(uptime % 60)} s \`\`\` `, inline: true },
                { name: '\`💻\` Ram', value: ` \`\`\`Total: ${(totalmem / 1024 / 1024).toFixed(1)} MB\nFree:  ${(freemem / 1024 / 1024).toFixed(1)} MB\nUsed:  ${(usedmem / 1024 / 1024).toFixed(1)} MB \`\`\` `, inline: true },
                { name: '\`📻\` OC:', value: ` \`\`\`${os.type()} ${os.release()} ${os.arch()} \`\`\` `, inline: true },
                { name: '\`💡\` Load of cores', value: ` \`\`\` ${loadavg[0].toFixed(2)} (1 min)\n ${loadavg[1].toFixed(2)} (5 min)\n ${loadavg[2].toFixed(2)} (15 min)\n\`\`\` `, inline: true },
                { name: '\`🔌\` CPU', value: ` \`\`\` ${cpus[0].model} @ ${cpus[0].speed.toFixed(2)} Mhz \`\`\` `, inline: true }
            )
            .setColor('#3366ff');
        await interaction.reply({ embeds: [embed] });
    },
};
