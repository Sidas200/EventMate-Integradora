const form = document.getElementById("login_usuario");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const dataForm = new FormData(form);
    const data = Object.fromEntries(dataForm);

    const infoMessageElement = document.getElementById("info-message");
    const errorMessageElement = document.getElementById("error-message");

    // Mostrar mensaje de "Iniciando sesión..."
    infoMessageElement.style.display = "block";
    errorMessageElement.style.display = "none";
    try {
        const response = await fetch("http://localhost:3000/login_cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        // Ocultar mensaje de "Iniciando sesión..."
        infoMessageElement.style.display = "none";

        if (!response.ok) {
            throw new Error("Correo o contraseña incorrectos, intentelo de nuevo");
        }

        // Esperar 2 segundos antes de redirigir
        setTimeout(() => {
            window.location.href = "../index/index.html";
        }, 1000);

    } catch (error) {
        console.error("Se produjo un error al iniciar sesión:", error);
        
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