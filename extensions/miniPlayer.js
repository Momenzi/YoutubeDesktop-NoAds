console.log('Picture-in-Picture Extension Loaded!');
function addPiPButton() {
    const controls = document.querySelector('.ytp-right-controls');
    if (!controls || document.getElementById('pipButton')) return;

    const pipButton = document.createElement('button');
    pipButton.id = 'pipButton'; 
    pipButton.classList.add('ytp-button');
    pipButton.title = 'Picture-in-Picture Mode';

    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttribute('width', '24');
    iconSVG.setAttribute('height', '24');
    iconSVG.setAttribute('viewBox', '0 0 24 24');
    iconSVG.setAttribute('fill', 'white');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M19 7h-5V5h5V2l4 3-4 3V7zM4 7h5V5H4V2L0 5l4 3V7zm15 5h-5v2h5v3l4-3-4-3v3zM4 17h5v-2H4v-3L0 15l4 3v-3z');
    
    iconSVG.appendChild(path);
    pipButton.appendChild(iconSVG);

    pipButton.style.transform = 'translateY(-10px) translateX(0px)';

    pipButton.onclick = () => {
        const video = document.querySelector('video');
        if (video && document.pictureInPictureEnabled) {
            video.requestPictureInPicture().catch(err => {
                console.error('❌ PiP Error:', err);
            });
        } else {
            console.warn('⚠ Picture-in-Picture not supported!');
        }
    };

    controls.appendChild(pipButton);
}

if (typeof window.miniPlayerObserver === 'undefined') {
    window.miniPlayerObserver = new MutationObserver(() => {
        addPiPButton();
    });

    window.miniPlayerObserver.observe(document.body, { childList: true, subtree: true });

    setTimeout(addPiPButton, 3000);

    console.log('✅ Picture-in-Picture extension fully loaded!');
}
