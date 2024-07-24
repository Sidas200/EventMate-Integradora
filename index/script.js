document.addEventListener('DOMContentLoaded', async () => {
    // Carrusel de imágenes
    const images = [
        "../assets/images/image-14cef189-1280-4dd7-a79f-3b5b38b000a5.JPG.webp",
        "../assets/images/photo-67407950-45df-4226-825c-dfe20c7d18f2.JPG.webp",
        "../assets/images/image-b192146d-7a62-463d-b437-8ff813ab8244.jpg.webp"
    ];
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

    // Cerrar sesión
    const logoutLinks = document.querySelectorAll(".nav-logged-in a[href='../logout/logout.html']");
    logoutLinks.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                const response = await fetch("http://localhost:3000/logout", {
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