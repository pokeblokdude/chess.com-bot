const fs = require('fs');
const { MessageEmbed } = require("discord.js");
const parser = require('./../modules/command-parser.js');

// BUG: people spamming reactions on and off literally tanks bot performance
module.exports = {
    name: 'Recruit*',
    command: 'recruit',
    description: "Sends a message that people can react to to sign up for an event.",
    usage: '`recruit {max people} [event name]`',
    execute(message, args) {
        if(!args.length) {
            message.channel.send(`Usage: ${this.usage}`);
            return;
        }
        // Check whether or not the first argument is a number. If so, remove it from the array and set it to 'maxPeople'
        let maxPeople = isNaN(Number(args[0])) ? undefined : args.shift();
        // Turn [word, word, word, ... word] (array of words) into "arg" string
        const title = parser.parseSingle(args);

        let obj = {
            title: title,
            recruitees: []
        };

        const user = message.author;
        const member = message.member;

        let embed = new MessageEmbed()
            .setAuthor((member.nickname || user.username), user.displayAvatarURL())
            .setTitle(`${obj.title}` + (maxPeople ? ` (${obj.recruitees.length}/${maxPeople})` : ''))
            .setDescription('No one has signed up yet!')
            .setTimestamp();
        
        message.channel.send(embed).then(msg => {
            console.log(`Created recruitment: ${obj.title}`);
            msg.react('✋');
            const filter = (reaction, user) => reaction.emoji.name === '✋';
            const collector = msg.createReactionCollector(filter, { time: 86400000, dispose: true });
            collector.on('collect', reaction => {
                obj.recruitees = reaction.users.cache.array();
                obj.recruitees = obj.recruitees.filter(user => !user.bot)
                if(obj.recruitees.length) {
                    let str = `**People:**\n`;
                    obj.recruitees.forEach(user => {
                        str = str.concat(`> <@!${user.id}>\n`)
                    });
                    let newEmbed = new MessageEmbed()
                        .setAuthor((member.nickname || user.username), user.displayAvatarURL())
                        .setTitle(`${obj.title}` + (maxPeople ? ` (${obj.recruitees.length}/${maxPeople})` : ''))
                        .setDescription(str + '\n')
                        .setTimestamp(embed.timestamp);
                    msg.edit(newEmbed);
                }
            });
            collector.on('remove', reaction => {
                obj.recruitees = reaction.users.cache.array();
                obj.recruitees = obj.recruitees.filter(user => !user.bot)
                if(obj.recruitees.length) {
                    let str = `**People:**\n`;
                    obj.recruitees.forEach(user => {
                        str = str.concat(`> <@!${user.id}>\n`)
                    });
                    let newEmbed = new MessageEmbed()
                        .setAuthor((member.nickname || user.username), user.displayAvatarURL())
                        .setTitle(`${obj.title}` + (maxPeople ? ` (${obj.recruitees.length}/${maxPeople})` : ''))
                        .setDescription(str + '\n')
                        .setTimestamp(embed.timestamp);
                    msg.edit(newEmbed);
                }
                else {
                    let newEmbed = new MessageEmbed()
                        .setAuthor((member.nickname || user.username), user.displayAvatarURL())
                        .setTitle(`${obj.title}` + (maxPeople ? ` (${obj.recruitees.length}/${maxPeople})` : ''))
                        .setDescription('No one has signed up yet!')
                        .setTimestamp(embed.timestamp);
                    msg.edit(newEmbed);
                }
            });
        }).catch(e => { throw e; });

        message.delete();
    }
}