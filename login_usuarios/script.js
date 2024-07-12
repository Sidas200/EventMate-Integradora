document.getElementById("login_usuario").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const correo = document.getElementById("correo").value;
    const contraseña_cliente = document.getElementById("contraseña").value;

    try {
        const response = await fetch("http://localhost:3000/login_cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo_electronico: correo, contraseña: contraseña_cliente }),
        });

        if (!response.ok) {
            throw new Error("Correo o contraseña incorrectos, intentelo de nuevo");
        }

        window.location.href = "../index/index.html";
    } catch (error) {
        console.error("Se produjo un error al iniciar sesión:", error);
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.textContent = error;
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
