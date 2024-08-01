document.addEventListener('DOMContentLoaded', () => {
    // Obtén los datos del venue desde los atributos de datos del HTML
    const venueDataElement = document.getElementById('venueData');

    const venue = {
        name: venueDataElement.dataset.name,
        images: venueDataElement.dataset.images.split(','), // Separa las imágenes por comas
        price: venueDataElement.dataset.price,
        description: venueDataElement.dataset.description,
        contact: venueDataElement.dataset.contact,
        comments: venueDataElement.dataset.comments.split('|') // Separa los comentarios por barras verticales
    };

    const venueImage = document.getElementById('venueImage');
    const venueInfo = document.getElementById('venueInfo');
    const venueContact = document.getElementById('venueContact');
    const venuePrice = document.getElementById('venuePrice');
    const commentsContainer = document.getElementById('commentsContainer');
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');

    let currentImageIndex = 0;

    function displayVenueDetails(venue) {
        venueImage.src = venue.images[currentImageIndex];
        venueImage.alt = venue.name;

        venueInfo.textContent = venue.description;
        venueContact.textContent = venue.contact;
        venuePrice.textContent = `Precio: $${venue.price}`;
    }

    function displayComments(comments) {
        commentsContainer.innerHTML = ''; // Limpiar comentarios anteriores
        comments.forEach(comment => {
            const commentElement = document.createElement('p');
            commentElement.textContent = comment;
            commentsContainer.appendChild(commentElement);
        });
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % venue.images.length;
        venueImage.src = venue.images[currentImageIndex];
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + venue.images.length) % venue.images.length;
        venueImage.src = venue.images[currentImageIndex];
    }

    function addComment(event) {
        event.preventDefault();
        const newComment = commentText.value.trim();
        if (newComment) {
            venue.comments.push(newComment);
            displayComments(venue.comments);
            commentText.value = ''; // Limpiar el campo de texto
        }
    }

    document.getElementById('nextImage').addEventListener('click', showNextImage);
    document.getElementById('prevImage').addEventListener('click', showPreviousImage);
    commentForm.addEventListener('submit', addComment);

    displayVenueDetails(venue);
    displayComments(venue.comments);
});
