const { Client, GatewayIntentBits, EmbedBuilder, ActivityType, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const config = require('./config');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

function setRandomStatus() {
    const randomIndex = Math.floor(Math.random() * config.activities.length);
    const activity = config.activities[randomIndex];
    client.user.setPresence({
        activities: [{ name: activity, type: ActivityType.Playing }],
        status: config.botSettings.status
    });
}

client.once('ready', async () => {
    console.log(`\x1b[1m\x1b[31m%s\x1b[0m`, `System | ${config.servername}`);
    console.log('\x1b[93m%s\x1b[0m', 'Befehle werden registriert.... Bot startet!'); 
    setRandomStatus();
    setInterval(setRandomStatus, config.botSettings.statusUpdateInterval); 
});

//// WELCOME
client.on('guildMemberAdd', async member => {
    const welcomeChannel = member.guild.channels.cache.get(config.channelIds.welcome);
    if (!welcomeChannel) return;
    const memberCount = member.guild.memberCount;
    const welcomeEmbed = new EmbedBuilder()
        .setColor(config.universelembedcolor)
        .setTitle('🎉 Willkommen auf DEIN SERVER NAME!')
        .setDescription(`<a:redarrow:1427371957413740756> **Hey** ${member}, \nWillkommen auf **DEIN SERVER NAME**!\n\n<a:redarrow:1427371957413740756> **Bitte verifiziere dich zuerst!** ${config.channelIds.verifychannellink}.\n\n<:ticketmodern:1427371963218788352> Bei Fragen stehen dir unsere Support-Tickets zur Verfügung!`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .addFields(
            { name: 'Total Member', value: `${memberCount}`, inline: true }
        )
        .setImage(`https://media.discordapp.net/attachments/1427334412043026634/1427337950903009432/DCBANNER_1.gif?ex=68f5170e&is=68f3c58e&hm=e103c1416f3555762fdaf8ff307227f82d049ec4f6649ad964f54a19fc36122e&width=360&height=202&`)
        .setTimestamp();

    await welcomeChannel.send({ content: `${member}`, embeds: [welcomeEmbed] });
    console.log('System Registriert: \x1b[1m\x1b[92m%s\x1b[0m', 'Welcome'); 
    try {
    } catch (error) {
        console.error('Fehler beim Registrieren der Befehle (Welcome):', error);
    }
});

// VERIFIZIERUNG
client.once('ready', async () => {
    try {
        await client.application.commands.create({
            name: 'verifizierung',
            description: 'Discord Regeln',
        });
        console.log('Befehl Registriert: \x1b[1m\x1b[92m%s\x1b[0m','Verifizierung');
    } catch (error) {
        console.error('Fehler beim Registrieren der Befehle (Verifizierung):', error);
    }
});
client.on('interactionCreate', async interaction => {
    if (interaction.isCommand() && interaction.commandName === 'verifizierung') {
        if (!interaction.member.roles.cache.has(config.roleIds.admin)) {
            await interaction.reply({ content: 'Du hast keine Rechte dazu.', ephemeral: true });
            return;
        }
        const embed = new EmbedBuilder()
            .setColor(config.universelembedcolor)
            .setTitle('Discord Regelwerk - DEIN SERVER NAME')
            .setAuthor({
                name: config.servername,
                iconURL: config.authorgifurl
            })
            .setDescription('Es gelten die Discord ToS!\nhttps://discord.com/terms\nhttps://discord.com/guidelines')
            .addFields(
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
                { name: 'DEINE SERVER REGELN', value: `DEINE SERVER REGELN`, inline: false },
            )
            .setFooter({ text: 'Discord Regelwerk - DEIN SERVER NAME' });
        const linkButton = new ButtonBuilder()
            .setLabel('✅ Regeln akzeptieren')
            .setURL(config.websites.verifylink)
            .setStyle(ButtonStyle.Link);
        const actionRow = new ActionRowBuilder()
            .addComponents(linkButton);
        await interaction.reply({ embeds: [embed], components: [actionRow] });
    }
});

client.login(config.TOKEN);