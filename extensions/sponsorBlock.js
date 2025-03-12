console.log('🎯 SponsorBlock Extension Loaded!');

const SPONSORBLOCK_API = 'https://sponsor.ajay.app/api/skipSegments?videoID=';

function showSkipMessage(startTime, endTime) {
    let existingMessage = document.getElementById('sponsorSkipMessage');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.id = 'sponsorSkipMessage';
    message.innerText = `⏩ Skipping sponsor segment: ${startTime.toFixed(2)}s → ${endTime.toFixed(2)}s`;
    message.style.position = 'absolute';
    message.style.top = '10%';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.padding = '10px 15px';
    message.style.background = 'rgba(0, 0, 0, 0.8)';
    message.style.color = 'white';
    message.style.fontSize = '16px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '9999';
    message.style.transition = 'opacity 0.5s ease-in-out';

    document.body.appendChild(message);
    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 500);
    }, 3000);
}

async function checkAndSkipSponsorSegments() {
    const videoElement = document.querySelector('video');
    if (!videoElement) {
       // console.warn('⚠ No video element found.');
        return;
    }

    const videoId = new URL(window.location.href).searchParams.get('v');
    if (!videoId) {
       // console.warn('⚠ No video ID found.');
        return;
    }

    try {
        const response = await fetch(`${SPONSORBLOCK_API}${videoId}&categories=["sponsor"]`);
        const data = await response.json();

        if (data.length > 0) {
            //console.log(`⏭ Found ${data.length} sponsor segments!`);

            data.forEach(segment => {
                const startTime = segment.segment[0];
                const endTime = segment.segment[1];
                const interval = setInterval(() => {
                    if (videoElement.currentTime >= startTime && videoElement.currentTime < endTime) {
                        console.log(`⏩ Auto-skipping sponsor: ${startTime.toFixed(2)}s -> ${endTime.toFixed(2)}s`);
                        showSkipMessage(startTime, endTime);
                        videoElement.currentTime = endTime;
                    }
                }, 1000);
                videoElement.addEventListener('ended', () => clearInterval(interval));
            });
        } else {
            console.warn('✅ No sponsor segments found.');
        }
    } catch (error) {
        console.error(`❌ Error fetching SponsorBlock data: ${error.message}`);
    }
}

const sponsorObserver = new MutationObserver(() => {
    checkAndSkipSponsorSegments();
});
sponsorObserver.observe(document.body, { childList: true, subtree: true });
//setTimeout(checkAndSkipSponsorSegments, 3000);
console.log('✅ SponsorBlock extension fully loaded!');
