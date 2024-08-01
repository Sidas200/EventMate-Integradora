document.addEventListener('DOMContentLoaded', async () => {
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');
    const quantityInput = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('totalPrice');
    const pricePerChair = 50.00;

    function updatePrice() {
        const quantity = parseInt(quantityInput.value) || 0;
        const totalPrice = pricePerChair * quantity;
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    quantityInput.addEventListener('input', updatePrice);

    async function loadComments() {
        try {
            const response = await fetch("http://localhost:3000/comentarios", {
                method: "GET",
                credentials: 'include',
            });

            if (response.ok) {
                const comments = await response.json();
                commentList.innerHTML = ''; // Limpiar la lista de comentarios

                comments.forEach(comment => {
                    const commentItem = document.createElement('div');
                    commentItem.classList.add('comment');
                    commentItem.innerHTML = `<strong>${comment.nombre_cliente}</strong>: <p>${comment.comentario}</p>`;
                    commentList.appendChild(commentItem);
                });
            } else {
                console.error("Error al obtener los comentarios");
            }
        } catch (error) {
            console.error("Se produjo un error al obtener los comentarios:", error);
        }
    }

    loadComments();

    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;
        if (commentText.trim() === '') return;

        try {
            const response = await fetch("http://localhost:3000/comentario", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ comentario: commentText })
            });

            if (response.ok) {
                const commentItem = document.createElement('div');
                commentItem.classList.add('comment');
                commentItem.innerHTML = `<p>${commentText}</p>`;
                commentList.appendChild(commentItem);
                document.getElementById('commentText').value = '';
            } else {
                console.error("Error al guardar el comentario en el servidor");
            }
        } catch (error) {
            console.error("Se produjo un error al guardar el comentario:", error);
        }
    });

    try {
        const response = await fetch("http://localhost:3000/autorizacion", {
            method: "GET",
            credentials: 'include',
        });

        if (response.ok) {
            const result = await response.json();
            const navLoggedInItems = document.querySelectorAll(".nav-logged-in");
            const navLoggedOutItems = document.querySelectorAll(".nav-logged-out");

            if (result.authenticated) {
                navLoggedInItems.forEach(item => item.style.display = "block");
                navLoggedOutItems.forEach(item => item.style.display = "none");
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
                const response = await fetch("http://localhost:3000/logout", {
                    method: "GET",
                    credentials: 'include',
                });
                if (response.ok) {
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