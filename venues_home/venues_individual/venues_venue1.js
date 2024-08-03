document.addEventListener('DOMContentLoaded', async () => {
    const venueDataElement = document.getElementById('venue1');

    const venue = {
        name: venueDataElement.dataset.name,
        tagline: venueDataElement.dataset.tagline,
        images: venueDataElement.dataset.images.split(','), // Keep image handling intact
        price: venueDataElement.dataset.price,
        description: venueDataElement.dataset.description,
        contact: venueDataElement.dataset.contact,
        features: venueDataElement.dataset.features.split(','),
        comments: venueDataElement.dataset.comments.split('|')
    };

    const venueImage = document.getElementById('venueImage');
    const venueName = document.getElementById('venueName');
    const venueTagline = document.getElementById('venueTagline');
    const venueInfo = document.getElementById('venueInfo');
    const venueContact = document.getElementById('venueContact');
    const venuePrice = document.getElementById('venuePrice');
    const commentsContainer = document.getElementById('commentsContainer');
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const venueFeatures = document.getElementById('venueFeatures');

    let currentImageIndex = 0;

    function displayVenueDetails(venue) {
        // Display venue details while keeping the image handling unchanged
        venueImage.src = venue.images[currentImageIndex].trim();
        venueImage.alt = venue.name;

        venueName.textContent = venue.name;
        venueTagline.textContent = venue.tagline;
        venueInfo.textContent = venue.description;
        venueContact.textContent = venue.contact;
        venuePrice.textContent = `Precio: $${venue.price}`;

        venueFeatures.innerHTML = ''; // Clear existing features
        venue.features.forEach(feature => {
            const featureElement = document.createElement('li');
            featureElement.textContent = feature.trim();
            venueFeatures.appendChild(featureElement);
        });
    }

    // Fetch and display comments specifically for venue1
    async function fetchCommentsForVenue1() {
        try {
            const response = await fetch('https://eventmate-integradora.onrender.com/comentarios_venue1');
            if (response.ok) {
                const comments = await response.json();
                displayComments(comments);
            } else {
                console.error('Error fetching comments for venue1:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching comments for venue1:', error);
        }
    }

    // Display comments in the commentsContainer
    function displayComments(comments) {
        commentsContainer.innerHTML = ''; // Clear previous comments
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `
                <p><strong>${comment.nombre_cliente}</strong> - ${formatDate(comment.fecha)}</p>
                <p>${comment.comentario}</p>
            `;
            commentsContainer.appendChild(commentElement);
        });
    }

    // Format the date for displaying comments
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Handle adding a comment for venue1
    async function addCommentForVenue1(event) {
        event.preventDefault();
        const newComment = commentText.value.trim();
        if (newComment) {
            try {
                const response = await fetch('https://eventmate-integradora.onrender.com/comentario_venue1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comentario: newComment }),
                    credentials: 'include'
                });

                if (response.ok) {
                    console.log('Comment added successfully for venue1');
                    fetchCommentsForVenue1(); // Refresh comments after adding
                    commentText.value = ''; // Clear the input field
                } else {
                    console.error('Error adding comment for venue1:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding comment for venue1:', error);
            }
        }
    }

    // Check authentication status and update navigation display
    try {
        const response = await fetch("https://eventmate-integradora.onrender.com/autorizacion", {
            method: "GET",
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            const navLoggedInItems = document.querySelectorAll(".nav-logged-in");
            const navLoggedOutItems = document.querySelectorAll(".nav-logged-out");

            if (result.authenticated) {
                navLoggedInItems.forEach(item => item.style.display = "block");
                navLoggedOutItems.forEach(item => item.style.display = "none");
            } else {
                navLoggedInItems.forEach(item => item.style.display = "none");
                navLoggedOutItems.forEach(item => item.style.display = "block");
            }
        } else {
            console.error("Error al verificar el estado de autenticación");
        }
    } catch (error) {
        console.error("Se produjo un error al verificar el estado de autenticación:", error);
    }

    // Event listeners for image navigation and comment form submission
    document.getElementById('nextImage').addEventListener('click', showNextImage);
    document.getElementById('prevImage').addEventListener('click', showPreviousImage);
    commentForm.addEventListener('submit', addCommentForVenue1);

    // Show the next image in the gallery
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % venue.images.length;
        venueImage.src = venue.images[currentImageIndex].trim();
    }

    // Show the previous image in the gallery
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + venue.images.length) % venue.images.length;
        venueImage.src = venue.images[currentImageIndex].trim();
    }

    // Initialize the venue details and comments display
    displayVenueDetails(venue);
    fetchCommentsForVenue1(); // Fetch and display existing comments for venue1
});
