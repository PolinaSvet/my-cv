class GalleryManager {
    constructor() {
        this.galleries = [];
        this.initGalleries();
    }

    initGalleries() {
        document.querySelectorAll('.dotnav-gallery').forEach((galleryEl, index) => {
            this.galleries.push(new Gallery(galleryEl, index));
        });
    }
}

class Gallery {
    constructor(galleryEl, index) {
        this.galleryEl = galleryEl;
        this.index = index;
        this.slides = galleryEl.querySelectorAll('.dotnav-gallery-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.autoRotateDelay = 5000;

        this.initDots();
        this.initThumbnails();
        this.startAutoAdvance();
        this.setupEventListeners();
    }

    initDots() {
        const dotsContainer = this.galleryEl.querySelector('.dotnav-gallery-dots');
        dotsContainer.innerHTML = '';

        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dotnav-gallery-dot';
            if (index === this.currentSlide) dot.classList.add('active');
            
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goToSlide(index);
            });
            
            dotsContainer.appendChild(dot);
        });
    }

    initThumbnails() {
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'thumbnail-container';
        this.galleryEl.insertBefore(thumbnailContainer, this.galleryEl.querySelector('.dotnav-gallery-dots').nextSibling);

        this.slides.forEach((slide, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.style.backgroundImage = slide.style.backgroundImage;
            if (index === this.currentSlide) thumbnail.classList.add('active');
            
            thumbnail.addEventListener('click', (e) => {
                e.stopPropagation();
                this.goToSlide(index);
            });
            
            thumbnailContainer.appendChild(thumbnail);
        });
    }

    goToSlide(index) {
        this.currentSlide = index;
        
        // Update slides
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        // Update dots
        const dots = this.galleryEl.querySelectorAll('.dotnav-gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update thumbnails
        const thumbnails = this.galleryEl.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Reset auto-advance timer
        this.resetAutoAdvance();
    }

    startAutoAdvance() {
        this.slideInterval = setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(this.currentSlide);
        }, this.autoRotateDelay);
    }

    resetAutoAdvance() {
        clearInterval(this.slideInterval);
        this.startAutoAdvance();
    }

    pauseAutoAdvance() {
        clearInterval(this.slideInterval);
    }

    setupEventListeners() {
        this.galleryEl.addEventListener('mouseenter', () => this.pauseAutoAdvance());
        this.galleryEl.addEventListener('mouseleave', () => this.startAutoAdvance());
        
        // Touch events for mobile devices
        this.galleryEl.addEventListener('touchstart', () => this.pauseAutoAdvance());
        this.galleryEl.addEventListener('touchend', () => this.startAutoAdvance());
    }
}

// Initialize all galleries when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});

