const adresse = "Leopoldschanze 34, 79206 Breisach am Rhein";

fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`
)
  .then(response => response.json())
  .then(data => {

    if (data.length === 0) {
      console.log("Adresse wurde nicht gefunden.");
      return;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;

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

  })
  .catch(error => {
    console.error("Fehler beim Laden der Karte:", error);
  });