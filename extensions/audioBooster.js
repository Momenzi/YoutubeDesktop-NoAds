console.log('Audio Booster & Equalizer Extension Loaded!');

function createAudioControls() {
    if (document.getElementById('audioBoosterControls')) return;

    const controls = document.createElement('div');
    controls.id = 'audioBoosterControls';
    controls.style.position = 'fixed';
    controls.style.bottom = '20px';
    controls.style.left = '20px';
    controls.style.width = '250px';
    controls.style.padding = '15px';
    controls.style.background = 'rgba(20, 20, 20, 0.9)';
    controls.style.color = 'white';
    controls.style.borderRadius = '10px';
    controls.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    controls.style.zIndex = '9999';
    controls.style.display = 'flex';
    controls.style.flexDirection = 'column';
    controls.style.gap = '10px';
    controls.style.fontFamily = 'Arial, sans-serif';

    function createSlider(labelText, min, max, step, defaultValue, callback) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        const label = document.createElement('span');
        label.innerText = labelText;
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '5px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = defaultValue;
        slider.style.width = '100%';
        slider.style.cursor = 'pointer';
        slider.style.accentColor = '#ffcc00';

        slider.oninput = () => callback(slider.value);

        container.appendChild(label);
        container.appendChild(slider);
        return container;
    }
    const volumeSlider = createSlider('🔊 Volume Boost', 1, 5, 0.1, 1, (value) => {
        gainNode.gain.value = value;
        console.log(`🔊 Volume Boost: ${value}x`);
    });

    const bassSlider = createSlider('🎸 Bass Boost', 0, 2, 0.1, 1, (value) => {
        bassEQ.gain.value = value * 10;
        console.log(`🎸 Bass Boost: ${value}`);
    });

    const trebleSlider = createSlider('🎵 Treble Boost', 0, 2, 0.1, 1, (value) => {
        trebleEQ.gain.value = value * 10;
        console.log(`🎵 Treble Boost: ${value}`);
    });

    const closeButton = document.createElement('button');
    closeButton.innerText = '❌ Close';
    closeButton.style.padding = '8px';
    closeButton.style.marginTop = '10px';
    closeButton.style.background = '#ff4444';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.fontSize = '14px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.transition = '0.3s ease-in-out';

    closeButton.onmouseover = () => closeButton.style.background = '#cc0000';
    closeButton.onmouseout = () => closeButton.style.background = '#ff4444';
    closeButton.onclick = () => controls.remove();

    controls.appendChild(volumeSlider);
    controls.appendChild(bassSlider);
    controls.appendChild(trebleSlider);
    controls.appendChild(closeButton);
    document.body.appendChild(controls);

    // Audio API
    const video = document.querySelector('video');
    if (!video) return;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(video);
    var gainNode = audioContext.createGain();
    var bassEQ = audioContext.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.value = 100;
    var trebleEQ = audioContext.createBiquadFilter();
    trebleEQ.type = 'highshelf';
    trebleEQ.frequency.value = 3000;

    source.connect(gainNode);
    gainNode.connect(bassEQ);
    bassEQ.connect(trebleEQ);
    trebleEQ.connect(audioContext.destination);

    video.onplay = () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };
}

function addAudioBoosterButton() {
    const controls = document.querySelector('.ytp-right-controls');
    if (!controls || document.getElementById('audioBoosterBtn')) return;

    const boosterButton = document.createElement('button');
    boosterButton.id = 'audioBoosterBtn';
    boosterButton.classList.add('ytp-button');
    boosterButton.title = 'Audio Booster & Equalizer';

    const iconSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSVG.setAttribute('width', '24');
    iconSVG.setAttribute('height', '24');
    iconSVG.setAttribute('viewBox', '0 0 24 24');
    iconSVG.setAttribute('fill', 'white');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 17h2v-10h-2v10zm4 4h2v-18h-2v18zm4-8h2v-6h-2v6zm4 12h2v-18h-2v18zm4-8h2v-6h-2v6z');
    
    iconSVG.appendChild(path);
    boosterButton.appendChild(iconSVG);

    boosterButton.style.transform = 'translateY(-14px) translateX(-10px)';

    boosterButton.onclick = createAudioControls;
    controls.appendChild(boosterButton);
}

const observer = new MutationObserver(() => {
    addAudioBoosterButton();
});

observer.observe(document.body, { childList: true, subtree: true });

setTimeout(addAudioBoosterButton, 3000);

console.log('✅ Audio Booster extension fully loaded!');
