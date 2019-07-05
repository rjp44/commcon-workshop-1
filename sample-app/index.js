const client = require('ari-client');

const config = require('config');

const url = `http://${config.get('asterisk.host')}:${config.get('asterisk.port')}/ari`;

const appName = 'myApp';
const username = config.get('asterisk.username');
const password = config.get('asterisk.password');
const soundurl = config.get('deepvoice.url');

const msgFormat = (msg, ari) => ({
    media: `sound:${soundurl}?text=${encodeURIComponent(msg)}`,
    playback: ari.Playback()
});



client.connect(url, username, password)
    .then(function (ari) {
        ari.on('StasisStart', (event, incoming) => {
            var channel = incoming;
            channel.answer()
                .then(() => {
                    channel.play(msgFormat('Hello and Welcome type some digits and see what happens.', ari))
                        .then((playback, incoming) => {
                            channel.on('ChannelDtmfReceived', (event, channel) => {
                                var digit = event.digit;
                                if (digit != '6')
                                    channel.play(msgFormat('you pressed the digit ' + digit + ' you naughty person do not do that again!', ari))
                                else
                                    channel.play(msgFormat('Great ' + digit + ' that was a cool choice Good work', ari))
                            });
                        })
                });
        });
        ari.start(appName);
    })
    .catch(function (err) {
        console.log(err);
    });
