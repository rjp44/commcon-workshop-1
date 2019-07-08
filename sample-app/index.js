const client = require('ari-client');

const config = require('config');

const url = `http://${config.get('asterisk.host')}:${config.get('asterisk.port')}/ari`;

const appName = config.get('asterisk.application');
const username = config.get('asterisk.username');
const password = config.get('asterisk.password');
const soundurl = config.get('deepvoice.url');

// Channel.play() wants an Object that contains the plaback URL and playback function
//  convenience function to populate this.
const msgFormat = (msg, ari) => ({
    media: `sound:${soundurl}?text=${encodeURIComponent(msg)}`,
    playback: ari.Playback()
});

client.connect(url, username, password)
    .then(function (ari) {
        ari.on('StasisStart', (event, incoming) => {
            var channel = incoming;
            console.log("New channel ", incoming.id);
            channel.answer()
                .then(() => {
                    console.log("Answered a call from ", channel.caller.number);
                    channel.play(msgFormat(`Hello ${channel.caller.number.split('').join(' ')}`, ari))
                    .then(() => channel.play(msgFormat('Welcome to our application', ari)))
                    .then(() => channel.play(msgFormat('Type some digits and see what happens', ari)));
                })
            channel.on('ChannelDtmfReceived', (event, channel) => {
                var digit = event.digit;
                console.log('got digit: ', digit);
                if (digit != '6') {
                    channel.play(msgFormat('you pressed the digit ' + digit, ari))
                        .then(() => channel.play(msgFormat('You naughty person', ari)))
                        .then(() => channel.play(msgFormat('Do not do that again!', ari)));
                } else {
                    channel.play(msgFormat('Great you pressed ' + digit, ari))
                        .then(() => channel.play(msgFormat('That was a cool choice', ari)))
                        .then(() => channel.play(msgFormat('Good work you win', ari)))
                        .then(() => channel.play(msgFormat('Nice talking to you Goodbye', ari)))
                        .then((playback, err) => playback.once('PlaybackFinished', () => channel.hangup()));
                }
            });

        });
        ari.start(appName);
    })
    .catch(function (err) {
        console.log(err);
    });
