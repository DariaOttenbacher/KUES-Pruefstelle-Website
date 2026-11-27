// ==============================
// NEWS
// ==============================

console.log("NEUER JS-CODE IST GELADEN");

const newsAusgabe = document.querySelector("#news-ausgabe");

const NEWS_CACHE_KEY = "newsCache";
const NEWS_CACHE_DAUER = 60 * 1000; // 1 Minute

async function ladeNews() {
  try {
    let daten;

    // Prüfen, ob Nachrichten im localStorage gespeichert sind.
    const cache = localStorage.getItem(NEWS_CACHE_KEY);

    if (cache) {
      try {
        const gespeichert = JSON.parse(cache);
        const alter = Date.now() - gespeichert.zeit;

        // Cache verwenden, wenn er jünger als 1 Minute ist.
        if (alter < NEWS_CACHE_DAUER) {
          daten = gespeichert.daten;
          console.log("Nachrichten aus localStorage geladen.");
        }
      } catch (fehler) {
        // Ungültigen Cache entfernen.
        localStorage.removeItem(NEWS_CACHE_KEY);
      }
    }

    // Nur laden, wenn keine gültigen Daten im Cache vorhanden sind.
    if (!daten) {
      const antwort = await fetch("/api/news");

      if (!antwort.ok) {
        throw new Error(
          "Nachrichten konnten nicht geladen werden."
        );
      }

      daten = await antwort.json();

      // Daten und Speicherzeit im localStorage speichern.
      localStorage.setItem(
        NEWS_CACHE_KEY,
        JSON.stringify({
          zeit: Date.now(),
          daten: daten
        })
      );

      console.log("Nachrichten über API geladen.");
    }

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

      beschreibung.className =
        "mb-4 text-gray-600";

      beschreibung.textContent =
        artikel.description ||
        "Keine Beschreibung verfügbar.";

      const datum = document.createElement("p");

      datum.className =
        "mb-4 text-sm text-gray-500";

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

      inhalt.append(
        titel,
        beschreibung,
        datum,
        link
      );

      karte.appendChild(inhalt);
      newsAusgabe.appendChild(karte);
    });

  } catch (fehler) {
    newsAusgabe.textContent =
      "Nachrichten konnten momentan nicht geladen werden.";

    console.error(
      "Fehler beim Laden der Nachrichten:",
      fehler
    );
  }
}

if (newsAusgabe) {
  ladeNews();
}


// ==============================
// TERMINFORMULAR
// ==============================

const terminFormular =
  document.querySelector("#termin-formular");

const datumFeld =
  document.querySelector("#datum");

const terminMeldung =
  document.querySelector("#termin-meldung");


// State - Render()

const state = {
  meldung: ""
};

function render() {
  if (terminMeldung) {
    terminMeldung.textContent = state.meldung;
  }
}

if (terminFormular && datumFeld && terminMeldung) {

  // Vergangene Tage im Kalender sperren.
  const heute = new Date();

  const jahr = heute.getFullYear();

  const monat = String(
    heute.getMonth() + 1
  ).padStart(2, "0");

  const tag = String(
    heute.getDate()
  ).padStart(2, "0");

  datumFeld.min =
    `${jahr}-${monat}-${tag}`;


  terminFormular.addEventListener(
    "submit",
    async (event) => {

      // Formular nicht normal abschicken
      // und Seite nicht neu laden.
      event.preventDefault();

      const datum =
        new Date(datumFeld.value + "T00:00:00");

      const wochentag = datum.getDay();

      // 3 = Mittwoch, 5 = Freitag
      if (wochentag !== 3 && wochentag !== 5) {
        state.meldung =
          "Termine sind nur mittwochs und freitags möglich.";

        render();
        return;
      }

      const name =
        document.querySelector("#name").value;

      const email =
        document.querySelector("#email").value;

      const telefon =
        document.querySelector("#telefon").value;

      try {
        const antwort = await fetch("/api/termin", {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name,
            email: email,
            telefon: telefon,
            datum: datumFeld.value
          })
        });

        if (!antwort.ok) {
          throw new Error(
            "E-Mail konnte nicht gesendet werden."
          );
        }

        state.meldung =
          "Ihre Terminanfrage wurde erfolgreich gesendet.";

        render();

        terminFormular.reset();

      } catch (fehler) {
        state.meldung =
          "Die Terminanfrage konnte nicht gesendet werden.";

        render();
      }
    }
  );
}


// ==============================
// BONUS: HU LEISTUNG MERKEN
// ==============================

const huButton =
  document.querySelector("#hu-merken");

const huLeistung =
  document.querySelector("#leistung-hu");

if (huButton && huLeistung) {
  let huGemerkt = false;

  // Gespeicherten Zustand beim Start lesen.
  try {
    const gespeichert =
      localStorage.getItem("huGemerkt");

    if (gespeichert !== null) {
      const wert = JSON.parse(gespeichert);

      if (typeof wert === "boolean") {
        huGemerkt = wert;
      } else {
        localStorage.removeItem("huGemerkt");
      }
    }

  } catch (fehler) {
    localStorage.removeItem("huGemerkt");
  }


  function renderHu() {
    if (huGemerkt) {
      huButton.textContent = "Gemerkt ✓";

      huLeistung.classList.add(
        "ring-4",
        "ring-yellow-300"
      );

    } else {
      huButton.textContent = "Merken";

      huLeistung.classList.remove(
        "ring-4",
        "ring-yellow-300"
      );
    }
  }


  huButton.addEventListener("click", () => {
    huGemerkt = !huGemerkt;

    localStorage.setItem(
      "huGemerkt",
      JSON.stringify(huGemerkt)
    );

    renderHu();
  });


  renderHu();
}