export default async function handler(req, res) {
  const token = process.env.NEWS_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      fehler: "API-Token fehlt"
    });
  }

  const url = new URL("https://api.thenewsapi.com/v1/news/all");

  url.searchParams.set("api_token", token);
  url.searchParams.set("language", "de");
  url.searchParams.set(
    "search",
    "Hauptuntersuchung Abgasuntersuchung Oldtimer H-Kennzeichen Gasprüfung Fahrzeugprüfung KÜS"
  );
  url.searchParams.set("limit", "10");

  try {
    const antwort = await fetch(url);

    if (!antwort.ok) {
      return res.status(502).json({
        fehler: `News-API antwortet mit ${antwort.status}`
      });
    }

    const daten = await antwort.json();

    const konkurrenz = ["dekra", "tüv", "gtü"];

    const artikel = daten.data
      .filter((artikel) => {
        const text =
          `${artikel.title ?? ""} ${artikel.description ?? ""}`.toLowerCase();

        return !konkurrenz.some((name) => text.includes(name));
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

    res.setHeader("Cache-Control", "s-maxage=600");

    return res.status(200).json({
      artikel
    });

  } catch {
    return res.status(500).json({
      fehler: "News-API nicht erreichbar"
    });
  }
}