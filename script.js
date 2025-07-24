document.addEventListener("DOMContentLoaded", () => {
  const locInput = document.getElementById('location');
  const preview = document.getElementById('preview');
  const endpoint = 'https://script.google.com/macros/s/AKfycbzLrmfMPCcX-xecbQveyOOjmITdOld7jgLwvDIGv0lu0MhYuXGukiPv9ecCc8vQ2TLw/exec';

  // Ottenere posizione geolocalizzata
  navigator.geolocation.getCurrentPosition(
    pos => locInput.value = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`,
    err => locInput.value = 'Posizione non disponibile'
  );

  // Anteprima immagine selezionata
  document.getElementById('photoInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      preview.src = ev.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  // Gestione invio form
  document.getElementById('dataForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const location = locInput.value;
    const timestamp = new Date().toISOString();
    const file = document.getElementById('photoInput').files[0];
    if (!file) return alert('Seleziona una foto');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const photo = reader.result;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8' // evita preflight
          },
          body: JSON.stringify({ username, timestamp, location, photo })
        });

        const json = await res.json();
        if (json.status === 'ok') {
          alert('✅ Dati inviati correttamente!');
          location.reload();
        } else {
          alert('❌ Errore durante l\'invio dei dati');
        }
      } catch (err) {
        console.error(err);
        alert('❌ Errore di rete');
      }
    };
    reader.readAsDataURL(file);
  });
});

