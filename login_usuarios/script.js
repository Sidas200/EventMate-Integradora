const form =document.getElementById("login_usuario");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const dataForm = new FormData(form);
    const data = Object.fromEntries(dataForm)
    try {
        const response = await fetch("http://localhost:3000/login_cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        if (!response.ok) {
            alert("Correo o contraseña incorrectos, intentelo de nuevo");
            throw new Error("Correo o contraseña incorrectos, intentelo de nuevo");
        }
        alert("Inicio de sesion exitoso");
        //window.location.href = "../index/index.html";
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

