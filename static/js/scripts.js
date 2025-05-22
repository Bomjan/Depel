let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slides img');  // Get all the images
const totalSlides = slides.length;  // Get the total number of images
const carouselSlides = document.querySelector('.carousel-slides');  // The slides container

// Function to show a specific slide
function showSlide(index) {
    const offset = -index * 100;  // Move the slides left by 100% of one image
    carouselSlides.style.transform = `translateX(${offset}%)`;  // Apply the transformation
}

// Function for the next slide
function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;  // Loop around to the first slide
    showSlide(currentIndex);
}

// Function for the previous slide
function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;  // Loop around to the last slide
    showSlide(currentIndex);
}

// Auto slide every 5 seconds
setInterval(nextSlide, 5000);

// Initialize the first slide
showSlide(currentIndex);

// Event listeners for prev and next buttons
document.querySelector('.carousel-prev').addEventListener('click', prevSlide);
document.querySelector('.carousel-next').addEventListener('click', nextSlide);

function email_not_sent(){
    document.getElementById('email_not_sent').textContent = 'Sorry, your email has not been sent.'
}