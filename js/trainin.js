document.addEventListener('DOMContentLoaded', () => {
  // Hero Carousel
  const heroEl = document.getElementById('heroCarousel');
  if (heroEl) {
    new bootstrap.Carousel(heroEl, {
      interval: 3000,
      ride: 'carousel',
      pause: false,
      wrap: true
    });
  }

  // Corrección Carrusel
  const MOBILE_MAX = 767.98;
  const galleryRow = document.querySelector('.row.g-4.mb-5');
  let carouselInitialized = false;

  function toggleMobileCarousel() {
    const isMobile = window.innerWidth <= MOBILE_MAX;
    if (isMobile && !carouselInitialized && galleryRow) {
      const carousel = document.createElement('div');
      carousel.id = 'mobileCarousel';
      carousel.classList.add('carousel', 'slide', 'carousel-fade');
      carousel.setAttribute('data-bs-ride', 'carousel');
      carousel.setAttribute('data-bs-interval', '3000');

      const inner = document.createElement('div');
      inner.classList.add('carousel-inner');

      Array.from(galleryRow.querySelectorAll('.col-md-4')).forEach((col, idx) => {
        galleryRow.removeChild(col);
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        if (idx === 0) item.classList.add('active');
        item.appendChild(col);
        inner.appendChild(item);
      });

      carousel.appendChild(inner);
      galleryRow.parentNode.replaceChild(carousel, galleryRow);

      new bootstrap.Carousel(carousel, {
        interval: 3000,
        ride: 'carousel',
        pause: false,
        wrap: true
      });

      carouselInitialized = true;
    }
    else if (!isMobile && carouselInitialized) {
      window.location.reload(); 
    }
  }

  toggleMobileCarousel();
  window.addEventListener('resize', toggleMobileCarousel);
});
