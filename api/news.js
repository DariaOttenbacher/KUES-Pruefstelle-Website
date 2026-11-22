const THEMEN = [
  "Hauptuntersuchung",
  "Abgasuntersuchung",
  "Oldtimer H-Kennzeichen",
  "KÜS Fahrzeugprüfung"
];

const KONKURRENTEN = [
  "dekra",
  "gtü",
  "gtu",
  "gtue",
  "tüv",
  "tuv"
];

export default async function handler(req, res) {
  const token = process.env.NEWS_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      fehler: "API-Token fehlt"
    });
  }

  try {
    const ergebnisse = [];

    // Anfragen nacheinander ausführen, nicht alle gleichzeitig.
    for (const thema of THEMEN) {
      const url = new URL(
        "https://api.thenewsapi.com/v1/news/all"
      );

      url.searchParams.set("api_token", token);
      url.searchParams.set("language", "de");
      url.searchParams.set("search", thema);
      url.searchParams.set("limit", "3");

      const antwort = await fetch(url);

      if (!antwort.ok) {
        const fehlermeldung = await antwort.text();

        console.error(
          `News-API-Fehler bei "${thema}":`,
          antwort.status,
          fehlermeldung
        );

        // Bei einem fehlerhaften Thema trotzdem weitermachen.
        continue;
      }

      const daten = await antwort.json();
      ergebnisse.push(...(daten.data ?? []));
    }

    const eindeutigeArtikel = Array.from(
      new Map(
        ergebnisse.map((artikel) => [
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

        return !KONKURRENTEN.some((name) =>
          text.includes(name)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.published_at) -
          new Date(a.published_at)
      )
      .slice(0, 3)
      .map((artikel) => ({
        title: artikel.title,
        description:
          artikel.description || artikel.snippet,
        url: artikel.url,
        image_url: artikel.image_url,
        published_at: artikel.published_at,
        source: artikel.source
      }));

    // 6 Stunden Cache statt nur 30 Minuten.
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=21600, stale-while-revalidate=86400"
    );

    return res.status(200).json({
      artikel: passendeArtikel
    });
  } catch (fehler) {
    console.error(
      "Fehler beim Laden der Nachrichten:",
      fehler
    );

    return res.status(500).json({
      fehler: "News-API nicht erreichbar"
    });
  }
}