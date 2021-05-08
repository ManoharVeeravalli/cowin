const player = require('play-sound')();
player.play('./media/roadrunner.mp3', (err) => {
    if (err) console.log(`Could not play sound: ${err}`);
});
