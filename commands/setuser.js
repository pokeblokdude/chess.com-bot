const fs = require('fs');
const eloHandler = require('./../modules/updateELO.js');
const ChessWebAPI = require('chess-web-api');
const chess = new ChessWebAPI();

module.exports = {
    name: 'Set User',
    command: 'setuser',
    description: "Saves your Chess.com username to access your player data.",
    usage: '`setuser`',
    async execute(message, args) {
        if(!args.length || args.length > 1) {
            message.channel.send(`Usage: ${this.usage}`);
            return;
        }

        let userJSON = JSON.parse(fs.readFileSync('./data/users.json'));

        try {
            let player = await chess.getPlayer(args[0]);
            if(player.body) {
                console.log(player);
                Object.defineProperty(userJSON, message.author.id, {
                    value: args[0],
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
                fs.writeFile('./data/users.json', JSON.stringify(userJSON, null, 4), err => { if(err) { throw err; } });
                message.channel.send(`Chess.com user for <@!${message.author.id}> set to \`${args[0]}\``);
                message.delete();
                eloHandler.updateELO();
            }
        }
        catch(e) {
            message.channel.send('User does not exist.');
            return;
        }
    }
}