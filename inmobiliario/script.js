document.addEventListener('DOMContentLoaded', async () => {
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
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const pricePerChair = 50.00; // Precio unitario de la silla

    function updateImage() {
        mainImage.src = images[currentImageIndex];
    }

    function updatePrice() {
        const quantity = parseInt(quantityInput.value) || 0;
        const totalPrice = pricePerChair * quantity;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateImage();
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateImage();
    });

    quantityInput.addEventListener('input', updatePrice);

    updateImage();
    updatePrice();

    async function loadComments() {
        try {
            const response = await fetch("/comentarios", {
                method: "GET",
                credentials: 'include',
            });

            if (response.ok) {
                const comments = await response.json();
                commentList.innerHTML = ''; // Limpiar la lista de comentarios

                comments.forEach(comment => {
                    const commentItem = document.createElement('div');
                    commentItem.classList.add('comment');
                    commentItem.innerHTML = `<strong>${comment.nombre_cliente}</strong>: <p>${comment.comentario}</p>`;
                    commentList.appendChild(commentItem);
                });
            } else {
                console.error("Error al obtener los comentarios");
            }
        } catch (error) {
            console.error("Se produjo un error al obtener los comentarios:", error);
        }
    }

    // Cargar los comentarios al cargar la página
    loadComments();

    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;
        if (commentText.trim() === '') return; // No agregar comentarios vacíos

        try {
            const response = await fetch("/comentario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ comentario: commentText })
            });

            if (response.ok) {
                // Agregar comentario a la lista de comentarios en la interfaz de usuario
                const commentItem = document.createElement('div');
                commentItem.classList.add('comment');
                commentItem.innerHTML = `<p>${commentText}</p>`;
                commentList.appendChild(commentItem);

                // Limpiar el campo de texto después de agregar el comentario
                document.getElementById('commentText').value = '';
            } else {
                console.error("Error al guardar el comentario en el servidor");
            }
        } catch (error) {
            console.error("Se produjo un error al guardar el comentario:", error);
        }
    });

    try {
        const response = await fetch("/autorizacion", {
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
            window.location.href = "../login_usuarios/login_usuario.html";
        }
    } catch (error) {
        console.error("Se produjo un error al verificar el estado de autenticación:", error);
        window.location.href = "../login_usuarios/login_usuario.html";
    }

    const logoutLinks = document.querySelectorAll(".nav-logged-in a[href='../logout/logout.html']");
    logoutLinks.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                const response = await fetch("/logout", {
                    method: "GET",
                    credentials: 'include',
                });
                if (response.ok) {
                    // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
                    window.location.href = "../login_usuarios/login_usuario.html";
                } else {
                    console.error("Error al cerrar la sesión");
                }
            } catch (error) {
                console.error("Se produjo un error al cerrar la sesión:", error);
            }
        });
    });
});