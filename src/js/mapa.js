(function() {
    const lat = 25.6859938;
    const lng = - 100.3034103;
    const mapa = L.map('mapa').setView([lat, lng ], 12);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()