const express = require('express');
const request = require('request');
const parse = require('../utils/parse');

const router = express.Router();

router.get('/', (req, res) => {
  const { name, url } = req.query;

  if (!name || name.trim() === '') {
    return res.status(400).send('Please provide a levelID or levelName.');
  }

  if (!url || url.trim() === '') {
    return res.status(400).send('Please provide a valid server URL.');
  }

  const isID = !isNaN(name);
  if (isID) {
    request.post(`http://${url}/downloadGJLevel22.php`, {
      form: {
        gameVersion: 21,
        levelID: name,
        secret: "Wmdf2893gb7"
      }
    }, function callback(err, httpResponse, body) {
      if (err) return res.status(500).send(err.message);
      if (body == -1) return res.status(404).send(`${name} cannot be found`);

      let levelInfo = body.split('#');
      let levelData = parse.parseResponse(levelInfo[0]);
      if (!levelData) return res.status(500).send('Failed to parse level data');

      let level = {
        levelID: levelData[1],
        levelName: levelData[2],
        description: parse.decodeLevelDesc(levelData[3] || ''),
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
        objects: levelData[45],
      };

      return res.json(level);
    });
  } else {
    let underscore = name.replace(/ /g, '_');
    request.post(`http://${url}/getGJLevels21.php`, {
      form: {
        gameVersion: 21,
        binaryVersion: 35,
        str: underscore,
        secret: "Wmdf2893gb7"
      }
    }, function callback(err, httpResponse, body) {
      if (err) return res.status(500).send(err.message);

      let data = body.split('#');
      let metaData = data[3].split(':');
      if (metaData[0] == 0) return res.status(404).send('No levels could be found');

      let levelArr = data[0].includes('|') ? data[0].split('|') : [data[0]];
      let levels = levelArr.map(levelStr => parse.parseResponse(levelStr));

      return res.json(levels);
    });
  }
});

module.exports = router;
