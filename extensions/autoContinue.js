console.log('AutoContinue Extension Loaded!');

let userPaused = false;
let lastTime = 0; 

function checkAndCloseIdlePopup() {
    const popup = document.querySelector('yt-confirm-dialog-renderer');

    if (popup) {
        console.log('🚫 Auto-closing "Are you still watching?" popup...');
        
        const closeButton = popup.querySelector('yt-button-renderer #button');
        if (closeButton) {
            closeButton.click();
        } else {
            console.warn('⚠ Close button not found inside popup.');
        }
    }
}

function preventAutoPause() {
    const video = document.querySelector('video');
    
    if (video) {
        if (!video.paused) {
            lastTime = video.currentTime;
        }

        if (video.paused && !userPaused && video.currentTime === lastTime) {
            console.log('▶ Video was auto-paused by YouTube, resuming playback...');
            video.play();
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'KeyK') {
        const video = document.querySelector('video');
        if (video) {
            userPaused = !video.paused;
            console.log(userPaused ? '⏸ User paused the video' : '▶ User resumed the video');
        }
    }
});

document.addEventListener('click', (event) => {
    const video = document.querySelector('video');
    if (!video) return;

    if (event.target === video || event.target.closest('.ytp-play-button')) {
        userPaused = video.paused;
        console.log(userPaused ? '⏸ User paused the video' : '▶ User resumed the video');
    }
});

if (typeof window.autoContinueObserver === 'undefined') {
    window.autoContinueObserver = new MutationObserver(() => {
        checkAndCloseIdlePopup();
        preventAutoPause();
    });

    window.autoContinueObserver.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        checkAndCloseIdlePopup();
        preventAutoPause();
    }, 5000);

    console.log('✅ AutoContinue extension fully loaded!');
}
