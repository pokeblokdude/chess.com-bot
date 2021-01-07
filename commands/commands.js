const fs = require('fs');
const { MessageEmbed } = require("discord.js");
const helper = require('./help.js');

module.exports = {
    name: 'Commands*',
    command: 'commands',
    description: "Sends a list of commands to the current channel. Non-Maids use !help.",
    usage: '`commands`',
    execute(message, args) {
        //               Engineer' (Our House) = 784934880433143809, "Admin" (Bot Testing) = 735229898871799971
        if(message.member.roles.cache.get('784934880433143809') || message.member.roles.cache.get('735229898871799971')) {
            let embed = helper.constructList();
            message.channel.send(embed);
            message.delete();
        }
        else {
            message.channel.send('Insufficient permissions.')
        }
        
    }
}