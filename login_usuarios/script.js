document.addEventListener('DOMContentLoaded', () => {
    const images = [
        '../assets/images/bck.webp', 
        '../assets/images/v2.webp',
        '../assets/images/cat1.jpg'
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
document.getElementById("login_usuario").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const correo = document.getElementById("username").value;
    const contraseña = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login_clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo_electronico: correo, contraseña: contraseña }),
        });

        if (!response.ok) {
            throw new Error("Correo o contraseña incorrectos, intentelo de nuevo");
        }

        window.location.href = "http://localhost:5500/index/index.html";
    } catch (error) {
        console.error("Se produjo un error al iniciar sesión:", error);
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.textContent = error.message;
        errorMessageElement.style.display = "block";

        setTimeout(() => {
            errorMessageElement.style.opacity = "0";
            setTimeout(() => {
                errorMessageElement.style.display = "none";
                errorMessageElement.style.opacity = "1"; 
            }, 2000); 
        }, 2000); 
    }
});