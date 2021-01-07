const fs = require('fs');
const ChessWebAPI = require('chess-web-api');
const chess = new ChessWebAPI();

module.exports = {
    async updateELO(client) {
        try {
            let userJSON = JSON.parse(fs.readFileSync('./data/users.json'));
            for(const key of Object.keys(userJSON)) {
                let guild = await client.guilds.resolve('796476454384566343');
                if(key === guild.ownerID) {
                    console.log(`Cannot update owner's nickname`);
                    continue;
                }
                let member = await guild.members.fetch(key);
                //console.log(member);
                let chessStats = await chess.getPlayerStats(userJSON[key]);
                let rating = chessStats.body.chess_rapid.last.rating;
                //console.log(rating);
                member.setNickname(`${userJSON[key]} [${rating}]`);
                console.log(`Updated rating for ${userJSON[key]}`);
            }
        }
        catch(e) {
            throw e;
        }
        
    }
}