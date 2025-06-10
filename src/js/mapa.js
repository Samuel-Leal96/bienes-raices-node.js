(function() {
    const lat = 25.6859938;
    const lng = - 100.3034103;
    const mapa = L.map('mapa').setView([lat, lng ], 12);

    let marker;

    //* Utilizar provider y geocoder de librerias en los scripts para obtener el nombre de la calle en base en las coordenadas.
    const geocodeService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //* El pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)


    //* Detectar el movimiento del PIN
    marker.on('moveend', function(e){
        marker = e.target;

        const posicion = marker.getLatLng(); //* Obtenemos el objeto con latitud y longitud el PIN

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        //* Obtener la información de las calles al soltar el PIN
        //* latlng(Objeto lat y long, zoom) 
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){
            //console.error(error);
            console.log(resultado);

            marker.bindPopup(resultado.address.LongLabel)

            //*Llenar los campos abajo del mapa con la info del marker
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })
    })


})()