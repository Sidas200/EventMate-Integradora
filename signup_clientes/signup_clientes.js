const form = document.getElementById("signup_cliente");

form.addEventListener("submit", async(event) => {
    event.preventDefault();

    const dataForm = new FormData(form);
    const data = Object.fromEntries(dataForm);

    try {
        const response = await fetch("https://eventmate-integradora.onrender.com/registrar", {  // URL de Render
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Datos no válidos");
        }

        window.location.href = "../login_usuarios/login_usuario.html";
    } catch (error) {
        console.error("Error al registrar al cliente", error);
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.textContent = error.message;  // Cambiar a error.message para mostrar solo el mensaje de error
        errorMessageElement.style.display = "block";

        setTimeout(() => {
            errorMessageElement.style.opacity = "0";
            setTimeout(() => {
                errorMessageElement.style.display = "none";
                errorMessageElement.style.opacity = "1";
            }, 1000);
        }, 1000);
    }
});