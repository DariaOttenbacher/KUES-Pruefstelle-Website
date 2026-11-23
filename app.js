const newsAusgabe = document.querySelector("#news-ausgabe");

async function ladeNews() {
  try {
    const antwort = await fetch("/api/news");

    if (!antwort.ok) {
      throw new Error("Nachrichten konnten nicht geladen werden.");
    }

    const daten = await antwort.json();

    newsAusgabe.textContent = "";

    if (!daten.artikel || daten.artikel.length === 0) {
      newsAusgabe.textContent =
        "Zurzeit sind keine passenden Nachrichten verfügbar.";
      return;
    }

    daten.artikel.forEach((artikel) => {
      const karte = document.createElement("article");
      karte.className =
        "overflow-hidden rounded-lg bg-white shadow-md";

      if (artikel.image_url) {
        const bild = document.createElement("img");
        bild.src = artikel.image_url;
        bild.alt = "";
        bild.className = "h-48 w-full object-cover";
        karte.appendChild(bild);
      }

      const inhalt = document.createElement("div");
      inhalt.className = "p-6";

      const titel = document.createElement("h3");
      titel.className =
        "mb-3 text-xl font-semibold text-gray-900";
      titel.textContent = artikel.title;

      const beschreibung = document.createElement("p");
      beschreibung.className = "mb-4 text-gray-600";
      beschreibung.textContent =
        artikel.description || "Keine Beschreibung verfügbar.";

      const datum = document.createElement("p");
      datum.className = "mb-4 text-sm text-gray-500";

      if (artikel.published_at) {
        datum.textContent = new Date(
          artikel.published_at
        ).toLocaleDateString("de-DE");
      }

      const link = document.createElement("a");
      link.href = artikel.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className =
        "inline-block rounded bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800";
      link.textContent = "Artikel lesen";

      inhalt.append(titel, beschreibung, datum, link);
      karte.appendChild(inhalt);
      newsAusgabe.appendChild(karte);
    });
  } catch (fehler) {
    newsAusgabe.textContent =
      "Nachrichten konnten momentan nicht geladen werden.";
  }
}

if (newsAusgabe) {
  ladeNews();
}

const terminFormular = document.querySelector("#termin-formular");
const datumFeld = document.querySelector("#datum");
const terminMeldung = document.querySelector("#termin-meldung");

if (terminFormular && datumFeld && terminMeldung) {

  // Vergangene Tage im Kalender sperren.
  const heute = new Date().toISOString().split("T")[0];
  datumFeld.min = heute;

  terminFormular.addEventListener("submit", (event) => {
    // Formular nicht normal abschicken und Seite nicht neu laden.
    event.preventDefault();

    const datum = new Date(datumFeld.value + "T00:00:00");
    const wochentag = datum.getDay();

    // 3 = Mittwoch, 5 = Freitag
    if (wochentag !== 3 && wochentag !== 5) {
      terminMeldung.textContent =
        "Termine sind nur mittwochs und freitags möglich.";
      return;
    }

    terminMeldung.textContent =
      "Ihre Terminanfrage wurde erfolgreich aufgenommen.";
  });
}
