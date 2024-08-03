document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verificar estado de autenticación
        const authResponse = await fetch("https://eventmate-integradora.onrender.com/autorizacion", {
            method: "GET",
            credentials: 'include',
        });

        if (authResponse.ok) {
            const authResult = await authResponse.json();
            const navLoggedInItems = document.querySelectorAll(".nav-logged-in");
            const navLoggedOutItems = document.querySelectorAll(".nav-logged-out");

            if (authResult.authenticated) {
                navLoggedInItems.forEach(item => item.style.display = "block");
                navLoggedOutItems.forEach(item => item.style.display = "none");

                // Obtener información del usuario
                const userResponse = await fetch("https://eventmate-integradora.onrender.com/user-info", {
                    method: "GET",
                    credentials: 'include',
                });

                if (userResponse.ok) {
                    const userResult = await userResponse.json();
                    
                    // Actualizar el contenido HTML con la información del usuario
                    const userNameElement = document.querySelector('.user-details h2');
                    const userEmailElement = document.querySelector('.user-details p.email');
                    const userPhoneElement = document.querySelector('.user-details p.phone');
                    const userAddressElement = document.querySelector('.user-details p.address');
                    const userBirthdayElement = document.querySelector('.user-details p.birthday');

                    if (userNameElement) {
                        userNameElement.textContent = `${userResult.nombre_cliente} ${userResult.apellido_cliente}`;
                    }
                    if (userEmailElement) {
                        userEmailElement.textContent = `Correo electrónico: ${userResult.correo_cliente}`;
                    }
                    if (userPhoneElement) {
                        userPhoneElement.textContent = `Teléfono: ${userResult.telefono_cliente}`;
                    }
                    if (userBirthdayElement) {
                        userBirthdayElement.textContent = `Fecha de nacimiento: ${userResult.fecha_nac}`;
                    }
                } else {
                    console.error("Error al obtener la información del usuario");
                }
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