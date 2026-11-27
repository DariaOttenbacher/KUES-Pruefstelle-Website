const adresse = "Leopoldschanze 34, 79206 Breisach am Rhein";

async function ladeKarte() {
  const status = document.getElementById("map-status");

  // Zustand 1: Lädt
  status.textContent = "Karte wird geladen...";

  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const daten = await res.json();

    // Zustand 3: Nichts gefunden
    if (daten.length === 0) {
      status.textContent = "Adresse wurde nicht gefunden.";
      return;
    }

    // Zustand 2: Daten da
    status.textContent = "";

    const lat = daten[0].lat;
    const lon = daten[0].lon;

    const map = L.map("map").setView([lat, lon], 16);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("KÜS Prüfstelle Breisach am Rhein")
      .openPopup();

  } catch (error) {
    // Zustand 4: Fehler
    status.textContent = "Karte konnte nicht geladen werden.";

    console.error(
      "Fehler beim Laden der Karte:",
      error
    );
  }
}

ladeKarte();