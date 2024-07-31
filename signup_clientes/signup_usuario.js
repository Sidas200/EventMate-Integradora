document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro_usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const confirmarContrasenaInput = document.getElementById('confirmar_contrasena');
    const errorContrasena = document.getElementById('error_contrasena');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const apellidoPaterno = document.getElementById('apellido_paterno').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const contrasena = contrasenaInput.value;
        const confirmarContrasena = confirmarContrasenaInput.value;
        const telefono = document.getElementById('telefono').value.trim();
        const fechaNacimiento = document.getElementById('fecha_nacimiento').value;

        let errores = [];

        if (nombre === '') {
            errores.push('El nombre es obligatorio.');
        }
        if (apellidoPaterno === '') {
            errores.push('El apellido paterno es obligatorio.');
        }
        if (correo === '' || !validarCorreo(correo)) {
            errores.push('El correo electrónico es inválido.');
        }
        if (contrasena === '' || contrasena.length < 8) {
            errores.push('La contraseña debe tener al menos 8 caracteres.');
        }
        if (contrasena !== confirmarContrasena) {
            errores.push('Las contraseñas no coinciden.');
        }
        if (telefono === '' || !validarTelefono(telefono)) {
            errores.push('El número de teléfono es inválido.');
        }
        if (fechaNacimiento === '') {
            errores.push('La fecha de nacimiento es obligatoria.');
        }

        if (errores.length > 0) {
            errorContrasena.innerHTML = errores.join('<br>');
        } else {
            errorContrasena.innerHTML = '';
            form.submit();
        }
    });

    function validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    }

    function validarTelefono(telefono) {
        const regex = /^\d{10}$/; // Ejemplo para un número de teléfono de 10 dígitos
        return regex.test(telefono);
    }
});
