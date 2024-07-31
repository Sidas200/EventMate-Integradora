const form = document.getElementById("signup_cliente");

form.addEventListener("submit", async(event) => {
event.preventDefault();

const dataForm = new FormData(form);
const data = Object.fromEntries(dataForm);


try {
    const response = await fetch("http://localhost:3000/registrar", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data),
        credentials: 'include'
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
document.getElementById('registroUsuario').addEventListener('click', function() {
    window.location.href = '../signup_clientes/signup_usuario.html';
});

document.getElementById('registroProveedor').addEventListener('click', function() {
    window.location.href = '../signup_clientes/signup_proveedor.html';
});
});