(() => {
  const studios = [
    {name: 'Via Michele di Lando, 41', type: 'Studio principale', position: [41.9140691, 12.5242156]},
    {name: 'Via Ugo Ojetti, 408', type: 'Studio secondario', position: [41.9480324, 12.5556641]}
  ];
  document.querySelectorAll('[data-studios-map]').forEach(block => {
    const canvas = block.querySelector('.studios-map-canvas');
    const error = block.querySelector('.studios-map-error');
    if (!window.L) { error.hidden = false; return; }
    const initialize = () => {
      canvas.textContent = '';
      const map = L.map(canvas, {scrollWheelZoom: false});
      const bounds = L.latLngBounds(studios.map(studio => studio.position));
      const reset = () => { map.closePopup(); map.fitBounds(bounds, {padding: [45, 45], maxZoom: 13, animate: false}); };
      reset();
      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      tiles.on('tileerror', () => { error.hidden = false; });
      const markers = studios.map((studio, i) => {
        const destination = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(studio.name + ', Roma');
        return L.marker(studio.position, {
          icon: L.divIcon({className: 'studio-map-pin', html: '<span>' + (i + 1) + '</span>', iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -35]}),
          title: studio.name, alt: studio.name, keyboard: true
        }).addTo(map).bindPopup('<div class="studio-map-popup"><small>' + studio.type + '</small><strong>' + studio.name + '</strong><p>Dott. Christian Galeotti<br>Su appuntamento</p><a href="' + destination + '" target="_blank" rel="noopener noreferrer">Ottieni indicazioni ↗</a></div>', {maxWidth: 250});
      });
      block.querySelectorAll('[data-studio]').forEach(button => button.addEventListener('click', () => {
        const i = Number(button.dataset.studio);
        map.setView(studios[i].position, 16, {animate: false}); markers[i].openPopup();
      }));
      block.querySelector('[data-map-reset]').addEventListener('click', reset);
      if (window.ResizeObserver) new ResizeObserver(() => map.invalidateSize()).observe(canvas);
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); initialize(); }
      }); observer.observe(block);
    } else initialize();
  });
})();
