function uponLoad() {
    const imageList = document.querySelector('.slider-wrapper .image-list');
    const slideButtons = document.querySelectorAll('.slider-wrapper .slide-button');
    let maxScrollLeft = imageList.scrollWidth;
    let scrollPosition = 0;

    console.log(maxScrollLeft)

    const updateScroll = () => {
        imageList.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        let totalScrollWidth = imageList.scrollWidth - scrollPosition;
        maxScrollLeft = totalScrollWidth - imageList.clientWidth;
    };

    const handleSlideButtons = () => {
        slideButtons[0].style.display = scrollPosition <= 0 ? 'none' : 'block';
        slideButtons[1].style.display = maxScrollLeft <= 0 ? 'none' : 'block';
    };

    slideButtons[0].addEventListener('click', () => {
        scrollPosition -= imageList.clientWidth * 0.5;
        updateScroll();
        handleSlideButtons();
    });

    slideButtons[1].addEventListener('click', () => {
        scrollPosition += imageList.clientWidth * 0.5;
        updateScroll();
        handleSlideButtons();
        console.log(scrollPosition);
        console.log(maxScrollLeft);
    });

    imageList.addEventListener('scroll', () => {
        scrollPosition = imageList.scrollLeft;
        handleSlideButtons();
    });

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

    }
}

// Call the entire function upon page load
window.addEventListener('load', uponLoad);
