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
  const SCREEN_MAX = 992;
  const galleryRow = document.querySelector('.row.g-4.mb-5');
  let carouselInitialized = false;

  function toggleCarousel() {
    const isMediumScreen = window.innerWidth <= SCREEN_MAX;
    if (isMediumScreen && !carouselInitialized && galleryRow) {
      const carousel = document.createElement('div');
      carousel.id = 'carousel';
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
    else if (!isMediumScreen && carouselInitialized) {
      window.location.reload(); 
    }
  }

  toggleCarousel();
  window.addEventListener('resize', toggleCarousel);
});
