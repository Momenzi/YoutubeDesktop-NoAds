console.log('🔊 Background Play Enabled!');

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        const video = document.querySelector('video');
        if (video) {
            video.play();
        }
    }
});
