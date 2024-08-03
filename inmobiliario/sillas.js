document.addEventListener('DOMContentLoaded', async () => {
    const images = [
        '../assets/images/SILLA-PLEGABLES-ACOJINADA.jpg',
        '../assets/images/silla_evento.png',
        '../assets/images/SILLA-PLEGABLES-ACOJINADA.jpg'
    ];
    
    const chairData = {
        "Silla Básica de Madera": {
            title: "Silla Básica de Madera",
            description: "Silla de madera con colchón",
            details: [
                "Altura: 90 cm",
                "Ancho: 45 cm",
                "Profundidad: 50 cm",
                "Material: Metal y plástico"
            ],
            price: "Precio por silla: $50MXN",
            contact: {
                name: "Pedro",
                number: "612525365",
                email: "pedro@hotmail.com"
            },
            imageIndex: 0
        },
        "Silla para Bodas": {
            title: "Silla para Bodas",
            description: "Silla blanca, con colchón y velo por detrás con arreglo floral",
            details: [
                "Altura: 90 cm",
                "Ancho: 45 cm",
                "Profundidad: 50 cm",
                "Material: Metal y plástico y tela"
            ],
            price: "Precio por silla: $70MXN",
            contact: {
                name: "Juan",
                number: "612525366",
                email: "juan@hotmail.com"
            },
            imageIndex: 1
        },
        "Silla formal con velo": {
            title: "Silla formal con velo",
            description: "Silla de metal color dorada, con colchón y velo sencillo blanco",
            details: [
                "Altura: 90 cm",
                "Ancho: 45 cm",
                "Profundidad: 50 cm",
                "Material: Metal y plástico"
            ],
            price: "Precio por silla: $40MXN",
            contact: {
                name: "Maria",
                number: "612525367",
                email: "maria@hotmail.com"
            },
            imageIndex: 2
        },
        "Silla formal con respaldo": {
            title: "Silla formal con respaldo",
            description: "Silla de plástico color dorado, con respaldo redondo y colchón",
            details: [
                "Altura: 90 cm",
                "Ancho: 45 cm",
                "Profundidad: 50 cm",
                "Material: Metal y plástico"
            ],
            price: "Precio por silla: $50MXN",
            contact: {
                name: "Ana",
                number: "612525368",
                email: "ana@hotmail.com"
            },
            imageIndex: 3
        }
    };

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

    function toggleNavItems(authenticated) {
        const navLoggedInItems = document.querySelectorAll(".nav-logged-in");
        const navLoggedOutItems = document.querySelectorAll(".nav-logged-out");
        
        navLoggedInItems.forEach(item => item.style.display = authenticated ? "block" : "none");
        navLoggedOutItems.forEach(item => item.style.display = authenticated ? "none" : "block");
    }

    function updateChairDetails(chairType) {
        const chair = chairData[chairType];

        if (!chair) return;

        document.getElementById('chair-title').innerText = chair.title;
        document.getElementById('chair-description').innerText = chair.description;
        
        const detailsList = document.getElementById('chair-details');
        detailsList.innerHTML = '';
        chair.details.forEach(detail => {
            const listItem = document.createElement('li');
            listItem.textContent = detail;
            detailsList.appendChild(listItem);
        });

        document.getElementById('chair-price').innerText = chair.price;

        const contactList = document.getElementById('contact-details');
        contactList.innerHTML = '';
        contactList.innerHTML = `
            <li>Nombre: ${chair.contact.name}</li>
            <li>Número: ${chair.contact.number}</li>
            <li>Correo Electrónico: ${chair.contact.email}</li>
        `;

        currentImageIndex = chair.imageIndex;
        updateImage();
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

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const chairType = card.getAttribute('data-chair');
            updateChairDetails(chairType);
        });
    });

    async function loadComments() {
        try {
            const response = await fetch("https://eventmate-integradora.onrender.com/comentarios", {
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

    async function checkAuthentication() {
        try {
            const response = await fetch("https://eventmate-integradora.onrender.com/autorizacion", {
                method: "GET",
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                toggleNavItems(result.authenticated);
            } else {
                console.error("Error al verificar el estado de autenticación");
                window.location.href = "../login_usuarios/login_usuario.html";
            }
        } catch (error) {
            console.error("Se produjo un error al verificar el estado de autenticación:", error);
            window.location.href = "../login_usuarios/login_usuario.html";
        }
    }

    async function handleLogout(event) {
        event.preventDefault();
        try {
            const response = await fetch("https://eventmate-integradora.onrender.com/logout", {
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
    }

    const logoutLinks = document.querySelectorAll(".nav-logged-in a[href='../logout/logout.html']");
    logoutLinks.forEach(link => link.addEventListener("click", handleLogout));

    // Cargar los comentarios al cargar la página
    loadComments();

    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;
        if (commentText.trim() === '') return; // No agregar comentarios vacíos

        try {
            const response = await fetch("https://eventmate-integradora.onrender.com/comentario", {
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

    checkAuthentication();
});

