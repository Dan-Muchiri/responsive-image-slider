function uponLoad() {
    const imageList = document.querySelector('.slider-wrapper .image-list');
    const slideButtons = document.querySelectorAll('.slider-wrapper .slide-button');
    const scrollbarThumb = document.querySelector('.slider-scrollbar .scrollbar-thumb');
    const playButton = document.querySelector('.play-Button');
    const audio = document.getElementById('background-music');

    let maxScrollLeft = imageList.scrollWidth;
    let scrollPosition = 0;
    let isDragging = false;

    const updateScroll = (behavior = 'smooth') => {
        imageList.scrollTo({
            left: scrollPosition,
            behavior: behavior
        });
        maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    };

    const handleSlideButtons = () => {
        slideButtons[0].style.display = scrollPosition <= 0 ? 'none' : 'block';
        slideButtons[1].style.display = maxScrollLeft <= 0 ? 'none' : 'block';
    };

    const startDragging = (e) => {
        isDragging = true;
        document.addEventListener('mousemove', handleDragging);
        document.addEventListener('mouseup', stopDragging);
    };

    const handleDragging = (e) => {
        if (isDragging) {
            const mouseX = e.clientX;
            const trackRect = scrollbarThumb.parentElement.getBoundingClientRect();
            const thumbRect = scrollbarThumb.getBoundingClientRect();

            // Calculate the new thumb position based on mouse movement
            let thumbPosition = mouseX - trackRect.left - thumbRect.width / 2;

            // Ensure the thumb stays within the scrollbar track
            thumbPosition = Math.max(0, Math.min(trackRect.width - thumbRect.width, thumbPosition));

            // Update scroll position based on the thumb position
            const thumbPercentage = thumbPosition / (trackRect.width - thumbRect.width);
            scrollPosition = thumbPercentage * maxScrollLeft;

            // Update the scrollbar thumb position and size without smooth scrolling during dragging
            updateThumb();
            updateScroll('auto'); // Use auto behavior to avoid delay
        }
    };

    const stopDragging = () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleDragging);
        document.removeEventListener('mouseup', stopDragging);
    };

    const updateThumb = () => {
        // Calculate thumb size based on the total scroll width
        const thumbSizePercentage = (imageList.clientWidth / imageList.scrollWidth) * 100;
        const initialThumbSizePercentage = 2; // Set your desired initial width here

        // Use the minimum value between the calculated size and the initial size
        const finalThumbSizePercentage = Math.min(thumbSizePercentage, initialThumbSizePercentage);
        scrollbarThumb.style.width = `${finalThumbSizePercentage}%`;

        // Calculate thumb position based on the scroll position and total scroll width
        const thumbPercentage = scrollPosition / maxScrollLeft;
        const trackRect = scrollbarThumb.parentElement.getBoundingClientRect();
        const thumbPosition = thumbPercentage * (trackRect.width - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    };

    const autoScroll = () => {
        let lastTimestamp;
    
        const scrollStep = (timestamp) => {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }
    
            const elapsed = timestamp - lastTimestamp;
            const scrollAmount = (imageList.clientWidth * 0.1 * elapsed) / 1000; // Pixels per millisecond
    
            scrollPosition += scrollAmount;
            updateScroll('auto');
            handleSlideButtons();
    
            lastTimestamp = timestamp;
    
            if (audio.paused) {
                return; // Stop scrolling when audio is paused
            }
    
            requestAnimationFrame(scrollStep);
        };
    
        requestAnimationFrame(scrollStep);
    };
    
    

    const play = () => {
        if (audio.paused) {
            audio.play();
            autoScroll();
            playButton.innerText = 'Pause';
        } else {
            audio.pause();
            playButton.innerText = 'Play';
        }
    };
    

    playButton.addEventListener('click', play);

    slideButtons[0].addEventListener('click', () => {
        scrollPosition -= imageList.clientWidth * 0.5;
        updateScroll();
        handleSlideButtons();
    });

    slideButtons[1].addEventListener('click', () => {
        scrollPosition += imageList.clientWidth * 0.5;
        updateScroll();
        handleSlideButtons();
    });

    imageList.addEventListener('scroll', () => {
        scrollPosition = imageList.scrollLeft;
        handleSlideButtons();
        updateThumb(); // Update thumb size and position while scrolling
    });

    scrollbarThumb.addEventListener('mousedown', startDragging);

    // Call the function to fetch images when the page loads
    fetchImages();

    function fetchImages() {
        imageList.innerHTML = '';

        for (let i = 1; i <= 126; i++) {
            const imageUrl = `./images/${i}.jpeg`;
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `img`;
            imgElement.classList.add('image-item');
            imageList.appendChild(imgElement);
        }

        maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
        handleSlideButtons();
        updateThumb(); // Update thumb size and position when images are loaded
    }
}

// Call the entire function upon page load
window.addEventListener('load', uponLoad);