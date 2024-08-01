document.addEventListener('DOMContentLoaded', function() {
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
            title: "Hacienda del Valle",
            imageUrl: "/assets/images/hacienda_del_valle.jpg",
            price: 22500,
            link: "../venues_home/venues_individual/venue_individual3.html"
        },
        {
            title: "Casino De Chihuahua",
            imageUrl: "/assets/images/casino_de_chihuahua.jpg",
            price: 30000,
            link: "../venues_home/venues_individual/venue_individual4.html"
        },
        {
            title: "Salon y Terraza Anita",
            imageUrl: "/assets/images/salon_anita.jpg",
            price: 20500,
            link: "../venues_home/venues_individual/venue_individual5.html"
        }
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
});

