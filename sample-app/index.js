const client = require('ari-client');

const config = require('config');

const url = `http://${config.get('asterisk.host')}:${config.get('asterisk.port')}/ari`;

const appName = config.get('asterisk.application');
const username = config.get('asterisk.username');
const password = config.get('asterisk.password');
const soundurl = config.get('deepvoice.url');

const redis = require('redis');
const redis_client = redis.createClient()

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
                .then(async () => {
                    console.log("Answered a call from ", channel.caller.number);
                    await channel.play(msgFormat(`Welcome to the voice based addition calculator.`, ari))
                    .then(async () => {
                        channel.play(msgFormat('Please enter the first number. I will wait', ari))
                        // Bind event post playback
                        channel.on('ChannelDtmfReceived', (event, channel) => {
                            let digit = event.digit;
                            console.log(`User entered ${digit}`)
                            redis_client.get(`first_number`, async function(err, number) {
                                if (!number) {
                                    // This is the first number
                                    await redis_client.set('first_number', digit)
                                    channel.play(msgFormat(`The first number is ${digit}. Please enter the second number`, ari))
                                }
                                else {
                                    // This is the second number
                                    // Add numbers
                                    await redis_client.del('first_number')
                                    calc = parseInt(digit) + parseInt(number)
                                    console.log(`Result is ${calc}`)
                                    channel.play(msgFormat(`The result is ${calc}`, ari))
                                    .then(() => {
                                        channel.hangup()
                                    })
                                }
                            });
                        });            
                    })
                })
        });
        ari.start(appName);
    })
    .catch(function (err) {
        console.log(err);
    });
