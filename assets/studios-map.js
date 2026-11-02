(() => {
  // Populate only with the public embed URL returned by Google My Maps.
  const embedUrl = 'https://www.google.com/maps/d/u/0/embed?mid=1VA6LsXmQZSjZ4Y6JqApZstElrVYmOno&ehbc=2E312F';
  if (!embedUrl) return;
  document.querySelectorAll('[data-studios-map]').forEach(container => {
    container.querySelector('iframe').src = embedUrl;
    container.hidden = false;
  });
})();
