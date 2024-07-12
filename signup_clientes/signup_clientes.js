        
        
        const form = document.getElementById("signup_cliente");

        form.addEventListener("submit", async(event) => {
        event.preventDefault();
    
        /*const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const fecha = document.getElementById("fecha").value;
        const contraseña = document.getElementById("contraseña").value;
        const confirmacion = document.getElementById("confirmacion").value;*/

        const dataForm = new FormData(form);
        const data = Object.fromEntries(dataForm);

    
        try {
            const response = await fetch("http://localhost:3000/clientes", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error("Datos no validos");
            }
    
            window.location.href = "../login_usuarios/login_usuario.html";
        } catch (error) {
            console.error("Error al registrar al cliente", error);
            const errorMessageElement = document.getElementById("error-message");
            errorMessageElement.textContent = error;
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
