
function handleSend() {
    document.getElementById('login_cliente').addEventListener('confirmacion', function(event) {
        event.preventDefault();
    
        const nombre_cliente = document.getElementById('nombre').value;
        const correo_cliente = document.getElementById('correo').value;
        const apellido_cliente = document.getElementById('apellido').value;
        const contraseña = document.getElementById('contraseña').value;
        const confirmar = document.getElementById('confirmar').value;
    
        fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_cliente, apellido_cliente, correo_cliente, contraseña, confirmar })
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            alert('Cliente registrado');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al enviar el cliente');
        });
    });
}
