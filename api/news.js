export default async function handler(req, res) {
  const token = process.env.NEWS_API_TOKEN;

  if (!token) {
    return res.status(500).json({ fehler: "API-Token fehlt" });
  }

  const url = new URL("https://api.thenewsapi.com/v1/news/all");
    url.searchParams.set("api_token", token);
    url.searchParams.set("language", "de");
    url.searchParams.set("search", "Hauptuntersuchung Deutschland");
    url.searchParams.set("limit", "3");

    try {
  const antwort = await fetch(url);

  if (!antwort.ok) {
    return res.status(502).json({
      fehler: `News-API antwortet mit ${antwort.status}`
    });
  }

  const daten = await antwort.json();
  return res.status(200).json(daten);

} catch {
  return res.status(500).json({
    fehler: "News-API nicht erreichbar"
  });
}
}