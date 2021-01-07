const fs = require('fs');
const eloHandler = require('./../modules/updateELO.js');
const ChessWebAPI = require('chess-web-api');
const chess = new ChessWebAPI();
const delay = require('delay');


module.exports = {
    name: 'Set User',
    command: 'setuser',
    description: "Saves your Chess.com username to access your player data.",
    usage: '`setuser [username] {nickname}`',
    async execute(message, args) {
        if(!args.length || args.length > 2) {
            message.channel.send(`Usage: ${this.usage}`);
            return;
        }
        let nickname = args.length === 2 ? args[1] : null;

        let userJSON = JSON.parse(fs.readFileSync('./data/users.json'));

        try {
            let player = await chess.getPlayer(args[0]);
            if(player.body) {
                console.log(player.body.username);
                Object.defineProperty(userJSON, message.author.id, {
                    value: {
                        username: args[0],
                        nickname: nickname
                    },
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
                fs.writeFile('./data/users.json', JSON.stringify(userJSON, null, 4), err => { if(err) { throw err; } });
                message.channel.send(`Chess.com user for <@!${message.author.id}> set to \`${args[0]}\``);
                message.delete();
            }
        }
        catch(e) {
            message.channel.send('User does not exist.');
            return;
        }
        await delay(500);
        eloHandler.updateELO();
    }
}