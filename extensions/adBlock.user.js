let ogVolume = 1, pbRate = 1, manualPause = false;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        manualPause = true;
    }
});

document.addEventListener('play', () => {
    manualPause = false;
});

document.addEventListener('pause', () => {
    manualPause = true;
});

const manip = (actions) => {
    actions.forEach(({ selector, action, func }) => {
        let elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if(element!==null && element!==undefined){
                if(element.style.display!=="none"){
                    if (action === 'remove') {
                        element.remove();
                    } else if (action === 'hide') {
                        element.style.display = "none";
                    } else if (action === 'click') {
                        element.click();
                    } else if (action === 'remove-run') {
                        element.remove();
                        eval(func);
                    }
                }
            }
        });
    });
};

const playVid = () => {
    const video = document.querySelector("video");
    if(video!==null){
        if(!video.playing && !manualPause && video.currentTime<1){
            video.play();
        }
    }
}

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});


/*const removeShorts = () => {
    if(should_Remove_Shorts == true){
        document.querySelectorAll(".style-scope.ytd-rich-shelf-renderer #title-container").forEach((shelf) => {
            if (shelf.innerText === "Shorts") {
                shelf.closest('ytd-rich-shelf-renderer').remove();
            }
        });
    }
};*/


const simulateClick = (element)=>{
    try{
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
            button: 0
        });

        element.dispatchEvent(mouseDownEvent);

        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
            button: 0
        });
        element.dispatchEvent(mouseUpEvent);
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
            button: 0
        });
        element.dispatchEvent(clickEvent);
    }catch(e){}
}

const simulateNativeTouch = (element) => {
    try{
        const touchPoint = new Touch({
            identifier: Date.now(),
            target: element,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        const touchStart = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touchPoint],
            targetTouches: [touchPoint],
            changedTouches: [touchPoint]
        });
        element.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touchPoint]
        });
        element.dispatchEvent(touchEnd);
    }catch(e){}
};


const rev = `
    ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
    #player-ads,
    #panels:has(ytd-ads-engagement-panel-content-renderer),
    ytd-ad-slot-renderer,
    #masthead-ad,
    ytd-reel-video-renderer:has(ytd-ad-slot-renderer),
    tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model),
    .yt-mealbar-promo-renderer {
        visibility: hidden;
        height: 0;
        margin: 0;
        padding: 0;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = rev;
document.head.appendChild(styleSheet);

setInterval(() => {
    try{

        manip([
            { selector: "tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)", action: 'remove-run', func: playVid()},
            { selector: ".ytp-ad-overlay-close-button", action: 'click' },
            { selector: ".style-scope.ytd-watch-next-secondary-results-renderer.sparkles-light-cta.GoogleActiveViewElement", action: 'hide' },
            { selector: ".style-scope.ytd-item-section-renderer.sparkles-light-cta", action: 'hide' },
            { selector: ".ytp-ad-message-container", action: 'hide' },
            { selector: ".style-scope.ytd-companion-slot-renderer", action: 'remove' },
            { selector: "#masthead-ad", action: 'remove' },
            { selector: "ytd-ad-slot-renderer", action: 'remove' },
            { selector: "ytd-reel-shelf-renderer", action: 'remove' },
            { selector: "ytd-player-legacy-desktop-watch-ads-renderer", action: 'hide'},
            { selector: ".ytp-ad-player-overlay-layout", action: 'hide' },
            { selector: "ytd-reel-video-renderer:has(.ytd-ad-slot-renderer)", action: "remove"},
            { selector: "ytd-in-feed-ad-layout-renderer", action: 'remove' },
            { selector: "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']", action: 'hide' },
            { selector: "ytd-popup-container:has(a[href='/premium'])", action: 'hide' },
            { selector: "yt-mealbar-promo-renderer", action: 'hide' }
        ]);

        let videoStream = document.querySelector("video"),
            skipAdButton = document.querySelector(`.ytp-skip-ad-button,.ytp-ad-skip-button,.ytp-ad-skip-button-modern`);


        if (videoStream) {

            let ad = document.querySelector(".video-ads.ytp-ad-module").firstChild || document.querySelector(".ytp-exp-ppp-update.ad-created.ad-showing.ad-interrupting");
            if (ad !== null) {
                //console.log("ad not null")
                //console.log(ad);
                if(ad.childElementCount > 0){
                    //console.log("ad children higher than 0")
                    //console.log("skipping with speed")
                    videoStream.playbackRate = 16;
                    if (!isNaN(videoStream.duration) && isFinite(videoStream.duration) &&
                        !isNaN(videoStream.currentTime) && isFinite(videoStream.currentTime)) {
                        videoStream.currentTime += videoStream.duration;
                    }
                    videoStream.muted = true;
                }
                else{
                    pbRate = videoStream.playbackRate;
                    videoStream.muted = false;
                }
            }else{
                pbRate = videoStream.playbackRate;
                videoStream.muted = false;
            }
        }

        if (skipAdButton !== null) {
            skipAdButton.click();
            simulateClick(skipAdButton);
            simulateNativeTouch(skipAdButton);
            console.log("skipAd button clicked.");
        }

    }catch(e){}

}, 10);


