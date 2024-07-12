document.addEventListener('DOMContentLoaded', () => {
    const images = [
        '../assets/images/SILLA-PLEGABLES-ACOJINADA.jpg',
        '../assets/images/silla_evento.png',
        '../assets/images/SILLA-PLEGABLES-ACOJINADA.jpg'
    ];
    let currentImageIndex = 0;
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');

    function updateImage() {
        mainImage.src = images[currentImageIndex];
    }

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
    });

    updateImage();

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;
        if (commentText.trim() === '') return; // No agregar comentarios vacíos

        const commentItem = document.createElement('div');
        commentItem.classList.add('comment');
        commentItem.innerHTML = `<p>${commentText}</p>`;
        commentList.appendChild(commentItem);

        // Limpiar el campo de texto después de agregar el comentario
        document.getElementById('commentText').value = '';
    });
});
