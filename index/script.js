document.addEventListener('DOMContentLoaded', () => {
  const images = [
      "../assets/images/image-14cef189-1280-4dd7-a79f-3b5b38b000a5.JPG.webp",
      "../assets/images/photo-67407950-45df-4226-825c-dfe20c7d18f2.JPG.webp",
      "../assets/images/image-b192146d-7a62-463d-b437-8ff813ab8244.jpg.webp"
  ];
  let currentImageIndex = 0;
  const banner = document.querySelector('.banner');

  function changeImage() {
      const currentImage = banner.querySelector('img.active');
      currentImage.classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % images.length;
      const nextImage = banner.querySelector(`img[data-index="${currentImageIndex}"]`);
      nextImage.classList.add('active');
  }

  images.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.setAttribute('data-index', index);
      if (index === 0) img.classList.add('active');
      banner.appendChild(img);
  });

  setInterval(changeImage, 3000);

  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
      card.addEventListener("click", function() {
          this.classList.toggle("flipped");
      });
  });
});