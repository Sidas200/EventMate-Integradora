document.addEventListener('DOMContentLoaded', async () => {
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
            //window.location.href = "../login_usuarios/login_usuario.html";
        }
    } catch (error) {
        console.error("Se produjo un error al verificar el estado de autenticación:", error);
        //window.location.href = "../login_usuarios/login_usuario.html";
    }
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

    // Funcionalidad de giro al hacer clic en el botón Select
    const selectButtons = document.querySelectorAll('.select-btn');
    selectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan');
            planCard.classList.toggle('flipped');
            const contactInfo = planCard.querySelector('.contact-info');
            if (contactInfo.style.display === "none") {
                contactInfo.style.display = "block";
            } else {
                contactInfo.style.display = "none";
            }
        });
    });
});