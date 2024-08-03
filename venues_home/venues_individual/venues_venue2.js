document.addEventListener('DOMContentLoaded', async () => {
    const venueDataElement = document.getElementById('venueData');

    const venue = {
        name: venueDataElement.dataset.name,
        tagline: "Un lugar para celebrar momentos especiales",
        images: venueDataElement.dataset.images.split(','),
        price: venueDataElement.dataset.price,
        description: venueDataElement.dataset.description,
        contact: venueDataElement.dataset.contact,
        comments: venueDataElement.dataset.comments.split('|')
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
        venueImage.src = venue.images[currentImageIndex].trim();
        venueImage.alt = venue.name;

        venueInfo.textContent = venue.description;
        venueContact.textContent = venue.contact;
        venuePrice.textContent = `Precio: $${venue.price}`;
    }

    // Function to fetch and display comments for venue2
    async function fetchCommentsForVenue2() {
        try {
            const response = await fetch(`http://localhost:3000/comentarios_venue2`);
            if (response.ok) {
                const comments = await response.json();
                displayComments(comments);
            } else {
                console.error('Error fetching comments for venue2:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching comments for venue2:', error);
        }
    }

    // Function to display comments in the commentsContainer
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

    // Function to format the date for displaying comments
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Function to handle adding a comment for venue2
    async function addCommentForVenue2(event) {
        event.preventDefault();
        const newComment = commentText.value.trim();
        if (newComment) {
            try {
                const response = await fetch('http://localhost:3000/comentario_venue2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comentario: newComment }),
                    credentials: 'include'
                });

                if (response.ok) {
                    console.log('Comment added successfully for venue2');
                    fetchCommentsForVenue2(); // Refresh comments after adding
                    commentText.value = ''; // Clear the input field
                } else {
                    console.error('Error adding comment for venue2:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding comment for venue2:', error);
            }
        }
    }

    // Check authentication status and update navigation display
    try {
        const response = await fetch("http://localhost:3000/autorizacion", {
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
    commentForm.addEventListener('submit', addCommentForVenue2);

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
    fetchCommentsForVenue2(); // Fetch and display existing comments for venue2
});
