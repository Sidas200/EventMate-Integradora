document.getElementById("signup_cliente").addEventListener("submit", async(event) => {
        event.preventDefault();
    
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const correo = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const fecha = document.getElementById("fecha").value;
        const contraseña = document.getElementById("contraseña").value;
        const confirmacion = document.getElementById("confirmacion").value;
    
        try {
            const response = await fetch("http://localhost:3000/clientes", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({ nombre_cliente: nombre, correo_cliente: correo, telefono_cliente: telefono, fecha_nac: fecha, contraseña: contraseña, confirmacion: confirmacion, apellido_cliente: apellido }),
            });
    
            if (!response.ok) {
                throw new Error("Datos no validos");
            }
    
            window.location.href = "http://localhost:5500/index/index.html";
        } catch (error) {
            console.error("Error al registrar al cliente", error);
            const errorMessageElement = document.getElementById("error-message");
            errorMessageElement.textContent = error.message;
            errorMessageElement.style.display = "block"; 
    
            setTimeout(() => {
                errorMessageElement.style.opacity = "0";
                setTimeout(() => {
                    errorMessageElement.style.display = "none";
                    errorMessageElement.style.opacity = "1"; 
                }, 1000);
            }, 5000); 
        }
    });
