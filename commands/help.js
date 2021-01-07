const fs = require('fs');
const { MessageEmbed } = require("discord.js");

const config = require('./../data/config.json');
const prefix = config.prefix;

module.exports = {
    name: 'Help',
    command: 'help',
    description: "DMs you a list of all commands, or sends info for a specified command.",
    usage: '`help {command}`',
    constructList() {
        let namelist = [];
        let desclist = [];
        let usagelist = [];

        var files = fs.readdirSync('./commands');
        let commandFiles = files.filter(file => file.endsWith('.js'));

        for(const file of commandFiles) {
            const command = require(`./${file}`);
            namelist.push(command.hasOwnProperty('name') ? command.name : 'unnamed');
            desclist.push(command.hasOwnProperty('description') ? command.description : 'no description');
            usagelist.push(command.hasOwnProperty('usage') ? command.usage : 'undefined usage');
        }

        const embed = new MessageEmbed()
            .setTitle('List of Our House Commands')
            .setColor('black')
            .setDescription('')
            .setFooter('Use `!help [command]` to see info for a specific command.')
        ;
        for(let i = 0; i < namelist.length; i++) {
            if(i === 0) {
                embed.setDescription(
                    embed.description.concat(`Prefix: \`${prefix}\` \n\nParameters:\n\`[]\` signifies a parameter.\n\`{}\` signifies an optional parameter.\nDo not include these symbols inside your actual command.\n\`"[]"\` indicates you must place the parameter inside of quotation marks.\n\nCommands with \`*\` are locked.\n\n`)
                );
            }
            embed.setDescription(
                embed.description.concat(`> __**${namelist[i]}**__ \n> *${desclist[i]}* \n> Usage: ${usagelist[i]}\n\n`)
            );
        }
        return embed;
    },
    execute(message, args) {
        // If a command was not specified
        if(!args.length) {
            let embed = this.constructList();
            message.author.send(embed).then(message.channel.send('DMed a list of commands!')).catch(() => message.reply("Unable to send DM."));
        }
        // If a command was specified
        else if(args.length === 1) {
            let commands = [];
            const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
            for(const file of commandFiles) {
                const command = require(`./../commands/${file}`);
                commands.push(command);
            }
            let index = -1;
            commands.forEach(cmd => {
                if(cmd.command === args[0]) {
                    index = commands.indexOf(cmd);
                    return;
                }
            });
            if(index !== -1) {
                let info = commands[index];
                let embed = new MessageEmbed()
                    .setTitle('Command: ' + info.name)
                    .setDescription(`Description:\n> *${info.description}*\n\nUsage: ${info.usage}`)
                    .setFooter('Use `!help` to be sent a list of all commands.');
                message.channel.send(embed);
            }
            else {
                message.channel.send('Command not found. Use !help to see a list of all commands.')
                return;
            }
        }
        // If there was more than one argument
        else {
            message.channel.send(`Usage: ${this.usage}`);
        }
    }
}