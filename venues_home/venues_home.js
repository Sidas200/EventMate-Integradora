document.addEventListener('DOMContentLoaded', async function() {
    const venuesContainer = document.getElementById('venuesContainer');
    const priceSort = document.getElementById('priceSort');

    const venues = [
        {
            title: "Quinta Victoria Momentos Únicos",
            imageUrl: "../assets/images/quinta_victoria2.jpg",
            price: 20000,
            link: "../venues_home/venues_individual/venue_quinta_victoria.html"
        },
        {
            title: "Salon Las Fuentes",
            imageUrl: "../assets/images/salon_las_fuentes.jpg",
            price: 19000,
            link: "../venues_home/venues_individual/venue_individual1.html"
        },
        {
            title: "Ballys",
            imageUrl: "/assets/images/ballys.jpg",
            price: 25000,
            link: "../venues_home/venues_individual/venue_individual2.html"
        },
        {
            title: "Ballys",
            imageUrl: "/assets/images/ballys.jpg",
            price: 25000,
            link: "../venues_home/venues_individual/venue_individual2.html"
        },
        {
            title: "Ballys",
            imageUrl: "/assets/images/ballys.jpg",
            price: 25000,
            link: "../venues_home/venues_individual/venue_individual2.html"
        },
        {
            title: "Ballys",
            imageUrl: "/assets/images/ballys.jpg",
            price: 25000,
            link: "../venues_home/venues_individual/venue_individual2.html"
        },
        {
            title: "Ballys",
            imageUrl: "/assets/images/ballys.jpg",
            price: 25000,
            link: "../venues_home/venues_individual/venue_individual2.html"
        },
    ];

    function loadVenues(venues) {
        venuesContainer.innerHTML = '';
        venues.forEach(venue => {
            const venueItem = document.createElement('div');
            venueItem.classList.add('venue-item');

            venueItem.innerHTML = `
                <a href="${venue.link}">
                    <img src="${venue.imageUrl}" alt="${venue.title}">
                    <h3>${venue.title}</h3>
                    <p>Precio: $${venue.price}</p>
                </a>
            `;

            venuesContainer.appendChild(venueItem);
        });
    }

    function sortVenues(order) {
        const sortedVenues = [...venues].sort((a, b) => {
            return order === 'asc' ? a.price - b.price : b.price - a.price;
        });
        loadVenues(sortedVenues);
    }

    loadVenues(venues);

    priceSort.addEventListener('change', function() {
        sortVenues(this.value);
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
                    console.log("Sesión cerrada exitosamente");
                } else {
                    console.error("Error al cerrar la sesión");
                }
            } catch (error) {
                console.error("Se produjo un error al cerrar la sesión:", error);
            }
        });
    });
});
