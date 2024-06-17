// Helper function to parse response from GD API
function parseResponse(data) {
    return data.split(':');
}

// Helper function to format level data
function formatLevelData(levelData) {
    return {
        levelID: levelData[1],
        levelName: levelData[2],
        description: levelData[3],
        version: levelData[5],
        playerID: levelData[6],
        difficulty: levelData[9],
        download: levelData[10],
        officialSong: levelData[12],
        gameVersion: levelData[13],
        likes: levelData[14],
        length: levelData[15],
        demon: levelData[17],
        stars: levelData[18],
        featured: levelData[19],
        auto: levelData[25],
        uploadDate: levelData[27],
        updateDate: levelData[29],
        copied: levelData[30],
        twoPlayer: levelData[31],
        customSong: levelData[35],
        coins: levelData[37],
        verifiedCoins: levelData[38],
        timelyID: levelData[41],
        epic: levelData[42],
        demondiff: levelData[43],
        objects: levelData[45]
    };
}

module.exports = {
    parseResponse,
    formatLevelData
};
