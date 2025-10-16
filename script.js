// Video Data
const videoData = [
    {
        title: 'Introduction Of American Hairline',
        description: 'Welcome to American Hairline. Discover our mission to restore not just hair, but confidence, using the world\'s most advanced non-surgical hair replacement solutions.',
        src: 'https://video.gumlet.io/680b63470527a5bd8ddeac39/68d650b329d13fb683cf4e1f/main.m3u8'
    },
    {
        title: 'Quick Talking Testimonials',
        description: 'Hear directly from our clients. Watch real stories and testimonials from individuals who have experienced the life-changing results of our hair systems.',
        src: 'https://video.gumlet.io/680b63470527a5bd8ddeac39/68d6345d29d13fb683cd3b8e/main.m3u8'
    },
    {
        title: 'Life Of The Hair System',
        description: 'Curious about durability and maintenance? This video explores the life of our hair systems, showing how they seamlessly integrate into your daily routine and lifestyle.',
        src: 'https://video.gumlet.io/680b63470527a5bd8ddeac39/68d6233529d13fb683cbeea5/main.m3u8'
    },
    {
        title: 'Natural Hairline',
        description: 'The secret to a perfect look is an undetectable hairline. See the artistry and craftsmanship that goes into creating a completely natural-looking result.',
        src: 'https://video.gumlet.io/680b63470527a5bd8ddeac39/68b96d6aa63a7a37582a391f/main.m3u8'
    }
];

// DOM Elements
const videoPlayer = document.getElementById('videoPlayer');
const nextVideoButton = document.getElementById('nextVideoButton');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const videoCounter = document.getElementById('videoCounter');
const unlockMessage = document.getElementById('unlockMessage');
const buttonText = document.getElementById('buttonText');
const buttonIcon = document.getElementById('buttonIcon');

// State
let currentVideoIndex = 0;
let hls = null;
let isVideoEnded = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadVideo(currentVideoIndex);
    updateUI();

    // Event Listeners
    videoPlayer.addEventListener('ended', handleVideoEnded);
    nextVideoButton.addEventListener('click', handleNextVideo);
});

// Load Video Function
function loadVideo(index) {
    if (index >= videoData.length) return;

    const currentVideo = videoData[index];
    const videoSrc = currentVideo.src;

    // Update text content
    videoTitle.textContent = currentVideo.title;
    videoDescription.textContent = currentVideo.description;

    // Check if the browser can play HLS natively (like Safari)
    if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = videoSrc;
    }
    // If not, use hls.js
    else if (Hls.isSupported()) {
        // Destroy previous instance if it exists
        if (hls) {
            hls.destroy();
        }

        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });

        hls.loadSource(videoSrc);
        hls.attachMedia(videoPlayer);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded successfully');
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Fatal network error encountered, trying to recover');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Fatal media error encountered, trying to recover');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error('Fatal error, cannot recover');
                        hls.destroy();
                        break;
                }
            }
        });
    } else {
        console.error('This browser does not support HLS playback.');
        alert('Your browser does not support video playback. Please use a modern browser like Chrome, Safari, or Firefox.');
    }

    // Reset state
    isVideoEnded = false;
    updateUI();
}

// Handle Video Ended
function handleVideoEnded() {
    isVideoEnded = true;
    updateUI();
}

// Handle Next Video Button Click
function handleNextVideo() {
    if (currentVideoIndex < videoData.length - 1) {
        currentVideoIndex++;
        loadVideo(currentVideoIndex);
    }
}

// Update UI
function updateUI() {
    const isLastVideo = currentVideoIndex === videoData.length - 1;

    // Update counter
    videoCounter.textContent = `Video ${currentVideoIndex + 1} of ${videoData.length}`;

    // Update button state
    nextVideoButton.disabled = !isVideoEnded || isLastVideo;

    // Update button text and icon
    if (isLastVideo) {
        buttonText.textContent = 'Series Complete';
        buttonIcon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>';
    } else {
        buttonText.textContent = 'Next Video';
        buttonIcon.innerHTML = '<polyline points="9 18 15 12 9 6"></polyline>';
    }

    // Show/hide unlock message
    if (!isVideoEnded && !isLastVideo) {
        unlockMessage.classList.remove('hidden');
    } else {
        unlockMessage.classList.add('hidden');
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (hls) {
        hls.destroy();
    }
});
