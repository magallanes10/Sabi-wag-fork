const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/prof', (req, res) => {
    const user = req.query.user;
    const url = req.query.url;

    if (!user) {
        return res.status(400).send('User parameter is required');
    }

    if (!url) {
        return res.status(400).send('URL parameter is required');
    }

    const userAgent = 'Mozilla 5.1';

    request.post(`${url}/getGJUsers20.php`, {
        headers: {
            'User-Agent': userAgent
        },
        form: {
            gameVersion: 21,
            binaryVersion: 35,
            gdw: 0,
            str: user,
            total: 0,
            page: 0,
            secret: "Wmdf2893gb7"
        }
    }, function callback(err, httpResponse, body) {
        if (body === '-1') {
            console.log('[LOG] ERROR: Profile can not be found - ' + body);
            return res.status(404).send('The Profile you are searching for cannot be found');
        }

        const parseResponse = (responseBody, splitter) => {
            if (!responseBody || responseBody == "-1") return {};
            let response = responseBody.split('#')[0].split(splitter || ':');
            let res = {};
            for (let i = 0; i < response.length; i += 2) {
                res[response[i]] = response[i + 1];
            }
            return res;
        };

        var userData = parseResponse(body);

        let data = {
            username: userData[1],
            userID: userData[2],
            secretCoins: userData[13],
            userCoins: userData[17],
            icons: userData[9],
            colour1: userData[10],
            colour2: userData[11],
            accountID: userData[16],
            stars: userData[3],
            creatorPoints: userData[8],
            Demons: userData[4]
        };

        request.post(`${url}/getGJUserInfo20.php`, {
            headers: {
                'User-Agent': userAgent
            },
            form: {
                targetAccountID: userData[16],
                gjp: "gjp" //cvolton why? lmao
            }
        }, function callback(err, httpResponse, body) {
            var userData = parseResponse(body);

            let data = {
                username: userData[1],
                playerID: userData[2],
                accountID: userData[16],
                rank: userData[30],
                stars: userData[3],
                diamonds: userData[46],
                coins: userData[13],
                userCoins: userData[17],
                demons: userData[4],
                cp: userData[8],
                moderator: userData[49],
                icon: userData[21],
                ship: userData[22],
                ball: userData[23],
                ufo: userData[24],
                wave: userData[25],
                robot: userData[26],
                spider: userData[43],
                col1: userData[10],
                col2: userData[11],
                deathEffect: userData[48],
                youTube: userData[20],
                twitter: userData[44],
                twitch: userData[45]
            };

            const modRoles = {
                '2': 'Elder Mod',
                '1': 'Mod'
            };

            const role = modRoles[userData[49]] || null;

            const youtube = data['youTube'] ? (data['youTube'].length < 15 ? `[YouTube](https://www.youtube.com/c/${data['youTube']})` : `[YouTube](https://www.youtube.com/channel/${data['youTube']})`) : 'None';
            const twitch = data['twitch'] ? `[${data['twitch']}](https://twitch.tv/${data['twitch']})` : 'None';
            const twitter = data['twitter'] ? `[@${data['twitter']}](https://twitter.com/${data['twitter']})` : 'None';

            const profileData = {
                user: data['username'],
                leaderboardRank: data['rank'],
                stats: {
                    stars: data['stars'],
                    diamonds: data['diamonds'],
                    goldCoins: data['coins'],
                    silverCoins: data['userCoins'],
                    demons: data['demons'],
                    cp: data['cp']
                },
                links: {
                    YouTube: youtube,
                    Twitter: twitter,
                    Twitch: twitch
                },
                accountID: data['accountID'],
                playerID: data['playerID']

            };

            if (role) {
                profileData.role = role;
            }

            res.json(profileData);
        });
    });
});

module.exports = router;
