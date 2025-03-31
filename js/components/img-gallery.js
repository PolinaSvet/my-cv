class GalleryManager {
    constructor() {
        this.allSlides = [];
        this.init();
    }

    init() {
        this.collectAllSlides();
        this.setupGalleryButton();
    }

    collectAllSlides() {
        document.querySelectorAll('.dotnav-gallery-iner').forEach(gallery => {
            const slides = gallery.querySelectorAll('.dotnav-gallery-slide-iner');
            slides.forEach(slide => {
                const imgUrl = slide.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)[1];
                const caption = slide.querySelector('.dotnav-gallery-caption-iner')?.innerHTML || '';
                
                this.allSlides.push({
                    imgUrl,
                    caption
                });
            });
        });
    }

    setupGalleryButton() {
        const btn = document.querySelector('.open-full-gallery-btn');
        if (btn) {
            btn.addEventListener('click', () => this.openFullGallery());
        }
    }

    openFullGallery() {
        if (this.allSlides.length === 0) {
            console.warn('No slides found for gallery');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'full-gallery-modal';
        modal.innerHTML = `
            <div class="full-gallery-overlay">
                <button class="close-gallery">&times;</button>
                <div class="gallery-container">
                    <div class="main-slide" style="background-image: url('${this.allSlides[0].imgUrl}')">
                        <div class="slide-caption">${this.allSlides[0].caption}</div>
                    </div>
                    <button class="nav-btn prev-btn">&lt;</button>
                    <button class="nav-btn next-btn">&gt;</button>
                </div>
                <div class="thumbnails-container"></div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        this.initFullGallery(modal);
    }

    initFullGallery(modal) {
        const mainSlide = modal.querySelector('.main-slide');
        const caption = modal.querySelector('.slide-caption');
        const prevBtn = modal.querySelector('.prev-btn');
        const nextBtn = modal.querySelector('.next-btn');
        const thumbnailsContainer = modal.querySelector('.thumbnails-container');
        const closeBtn = modal.querySelector('.close-gallery');

        let currentIndex = 0;

        // Создаем миниатюры
        this.allSlides.forEach((slide, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail';
            thumb.style.backgroundImage = `url('${slide.imgUrl}')`;
            if (index === 0) thumb.classList.add('active');
            
            thumb.addEventListener('click', () => {
                this.updateGallery(index, mainSlide, caption);
                currentIndex = index;
                this.updateThumbnails(thumbnailsContainer, index);
            });
            
            thumbnailsContainer.appendChild(thumb);
        });

        // Навигация
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + this.allSlides.length) % this.allSlides.length;
            this.updateGallery(currentIndex, mainSlide, caption);
            this.updateThumbnails(thumbnailsContainer, currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % this.allSlides.length;
            this.updateGallery(currentIndex, mainSlide, caption);
            this.updateThumbnails(thumbnailsContainer, currentIndex);
        });

        // Закрытие
        closeBtn.addEventListener('click', () => {
            document.body.style.overflow = '';
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.style.overflow = '';
                modal.remove();
            }
        });

        // Навигация клавиатурой
        document.addEventListener('keydown', (e) => {
            if (!modal.isConnected) return;
            
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        });
    }

    updateGallery(index, mainSlide, caption) {
        const slide = this.allSlides[index];
        mainSlide.style.backgroundImage = `url('${slide.imgUrl}')`;
        caption.innerHTML = slide.caption;
    }

    updateThumbnails(container, activeIndex) {
        container.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === activeIndex);
        });
    }
}

class GalleryIner {
    constructor(galleryElement) {
        this.gallery = galleryElement;
        this.container = galleryElement.querySelector('.dotnav-gallery-container-iner');
        this.slides = galleryElement.querySelectorAll('.dotnav-gallery-slide-iner');
        this.prevBtn = galleryElement.querySelector('.prev-btn-iner');
        this.nextBtn = galleryElement.querySelector('.next-btn-iner');
        this.dotsContainer = galleryElement.querySelector('.dotnav-gallery-dots-iner');
        this.currentIndex = 0;
        
        this.initDots();
        this.setupEventListeners();
    }
    
    initDots() {
        this.dotsContainer.innerHTML = '';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dotnav-gallery-dot-iner';
            if (index === this.currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            this.dotsContainer.appendChild(dot);
        });
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Для сенсорных устройств
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }
    
    goToSlide(index) {
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[index].classList.add('active');
        
        // Обновляем точки
        const dots = this.dotsContainer.querySelectorAll('.dotnav-gallery-dot-iner');
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        this.currentIndex = index;
    }
    
    prevSlide() {
        const newIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(newIndex);
    }
    
    nextSlide() {
        const newIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(newIndex);
    }
    
    handleSwipe() {
        if (this.touchStartX - this.touchEndX > 50) {
            // Свайп влево
            this.nextSlide();
        } else if (this.touchEndX - this.touchStartX > 50) {
            // Свайп вправо
            this.prevSlide();
        }
    }
}

// Инициализация всех галерей на странице
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dotnav-gallery-iner').forEach(gallery => {
        new GalleryIner(gallery);
    });
});

// Initialize all galleries when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});