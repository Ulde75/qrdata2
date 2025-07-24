document.addEventListener("DOMContentLoaded", () => {
  const locInput = document.getElementById('location');
  const preview = document.getElementById('preview');
  const endpoint = 'YOUR_WEB_APP_URL_HERE';

  navigator.geolocation.getCurrentPosition(
    pos => locInput.value = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`,
    err => locInput.value = 'Posizione non disponibile'
  );

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
          body: JSON.stringify({username, timestamp, location, photo}),
          headers: {'Content-Type': 'application/json'}
        });
        const json = await res.json();
        if (json.status === 'ok') {
          alert('Dati inviati correttamente!');
          location.reload();
        } else alert('Errore nell’invio');
      } catch (err) {
        console.error(err);
        alert('Errore di rete');
      }
    };
    reader.readAsDataURL(file);
  });
});

