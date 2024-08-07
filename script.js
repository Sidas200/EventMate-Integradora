document.addEventListener('DOMContentLoaded', async () => {
    // Carrusel de imágenes
    const images = [
        "../assets/images/michael-wave-gVkAiPchYhY-unsplash.jpg",
        "../assets/images/aneta-pawlik-GJwKzsxUQu4-unsplash.jpg",
        "../assets/images/aniket-narula-5_mQ5qhfCE4-unsplash.jpg"
    ];
    //imagenes de arriba son placeholders CAMBIARLAS!! (susana)
    let currentImageIndex = 0;
    const banner = document.querySelector('.banner');

    function changeImage() {
        const currentImage = banner.querySelector('img.active');
        if (currentImage) {
            currentImage.classList.remove('active');
        }
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

    // Flip de tarjetas
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("click", function() {
            this.classList.toggle("flipped");
        });
    });

    // Verificar estado de autenticación
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

    // Obtener y mostrar información del token
    try {
        const response = await fetch('https://eventmate-integradora.onrender.com/info-token', {
            method: 'GET',
            credentials: 'include' // Asegúrate de incluir las cookies en la solicitud
        });

        if (response.ok) {
            const data = await response.json();
            const payload = data.data && data.data.payload;
            console.log(data);

            if (payload) {
                // Muestra todo el contenido del payload para depuración
                console.log('Payload completo:', payload);

                // Verifica si el campo 'id' está presente en el payload
                if ('id' in payload) {
                    const userId = payload.id;
                    console.log('ID del usuario:', userId);

                    // Opcional: Mostrar el ID en el DOM
                    const userIdElement = document.querySelector('#user-id');
                    if (userIdElement) {
                        userIdElement.textContent = `ID del usuario: ${userId}`;
                    }
                } else {
                    console.error('El campo "id" no se encontró en el payload');
                }

                // Puedes manejar otros campos del payload si es necesario
                if ('otherField' in payload) {
                    const otherField = payload.otherField;
                    console.log('Otro campo:', otherField);
                }

            } else {
                console.error('No se encontró el payload en la respuesta');
            }
        } else {
            console.error("Error al obtener la información del token");
        }
    } catch (error) {
        console.error('Se produjo un error al obtener la información del token:', error);
    }

    // Cerrar sesión
    const logoutLinks = document.querySelectorAll(".nav-logged-in a[href='../logout/logout.html']");
    logoutLinks.forEach(link => {
        link.addEventListener("click", async (event) => {
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
        });
    });
});