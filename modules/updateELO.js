const fs = require('fs');
const ChessWebAPI = require('chess-web-api');
const chess = new ChessWebAPI();
const delay = require('delay');

module.exports = {
    async updateELO(client) {
        try {
            let userJSON = JSON.parse(fs.readFileSync('./data/users.json'));
            for(const key of Object.keys(userJSON)) {
                console.log(userJSON[key]);
                let guild = await client.guilds.resolve('796476454384566343');
                if(key === guild.ownerID) {
                    console.log(`Cannot update owner's nickname`);
                    continue;
                }
                let member = await guild.members.fetch(key);
                let chessStats = await chess.getPlayerStats(userJSON[key].username);
                let rating = chessStats.body.chess_rapid.last.rating;
                
                member.setNickname(`${userJSON[key].nickname || userJSON[key].username} [${rating}]`).catch(e => { console.log('Cannot update nickname'); });
                console.log(`Updated rating for ${userJSON[key].nickname || userJSON[key].username}`);
            }
        }
        catch(e) {
            throw e;
        }
        
    }
}