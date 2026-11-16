const THEMEN = [
  "Hauptuntersuchung",
  "Abgasuntersuchung",
  "Oldtimer",
  "H-Kennzeichen",
  "Gasprüfung",
  "Fahrzeugprüfung",
  "KÜS",
  "KUS",
  "KUES"
];

const KONKURRENTEN = [
  "dekra",
  "gtü",
  "gtu",
  "gtue"
];

export default async function handler(req, res) {
  const token = process.env.NEWS_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      fehler: "API-Token fehlt"
    });
  }

  try {
    // Für jedes Thema wird eine eigene URL erzeugt.
    const anfragen = THEMEN.map((thema) => {
      const url = new URL(
        "https://api.thenewsapi.com/v1/news/all"
      );

      url.searchParams.set("api_token", token);
      url.searchParams.set("language", "de");
      url.searchParams.set("search", thema);
      url.searchParams.set("limit", "3");

      return fetch(url);
    });

    // Alle sieben API-Anfragen werden parallel ausgeführt.
    const antworten = await Promise.all(anfragen);

    // Prüfen, ob eine Anfrage fehlgeschlagen ist.
    const fehlerhafteAntwort = antworten.find(
      (antwort) => !antwort.ok
    );

    if (fehlerhafteAntwort) {
      return res.status(502).json({
        fehler:
          `News-API antwortet mit ${fehlerhafteAntwort.status}`
      });
    }

    // Alle Antworten werden von JSON in JavaScript-Objekte umgewandelt.
    const ergebnisse = await Promise.all(
      antworten.map((antwort) => antwort.json())
    );

    // Die Artikel aller Themen werden in einem Array zusammengeführt.
    const alleArtikel = ergebnisse.flatMap(
      (ergebnis) => ergebnis.data ?? []
    );

    // Doppelte Artikel anhand von uuid oder URL entfernen.
    const eindeutigeArtikel = Array.from(
      new Map(
        alleArtikel.map((artikel) => [
          artikel.uuid ?? artikel.url,
          artikel
        ])
      ).values()
    );

    const passendeArtikel = eindeutigeArtikel
      .filter((artikel) => {
        const text = [
          artikel.title,
          artikel.description,
          artikel.snippet,
          artikel.source
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const nenntKonkurrenten = KONKURRENTEN.some(
          (name) => text.includes(name)
        );

        return !nenntKonkurrenten;
      })
      .sort((artikelA, artikelB) => {
        return (
          new Date(artikelB.published_at) -
          new Date(artikelA.published_at)
        );
      })
      .slice(0, 3)
      .map((artikel) => ({
        title: artikel.title,
        description: artikel.description,
        url: artikel.url,
        image_url: artikel.image_url,
        published_at: artikel.published_at,
        source: artikel.source
      }));

    // Ergebnis für 30 Minuten bei Vercel zwischenspeichern.
    res.setHeader(
      "Cache-Control",
      "s-maxage=1800, stale-while-revalidate=3600"
    );

    return res.status(200).json({
      artikel: passendeArtikel
    });
  } catch (fehler) {
    console.error("Fehler beim Laden der Nachrichten:", fehler);

    return res.status(500).json({
      fehler: "News-API nicht erreichbar"
    });
  }
}