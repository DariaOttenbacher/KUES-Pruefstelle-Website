import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      fehler: "Nur POST-Anfragen erlaubt"
    });
  }

  const { name, email, telefon, datum } = req.body;

  if (!name || !email || !telefon || !datum) {
    return res.status(400).json({
      fehler: "Bitte alle Felder ausfüllen."
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "KÜS Terminanfrage <onboarding@resend.dev>",
      to: ["ottenbacher.dari.a25@student.dhbw-karlsruhe.de"],

      subject: `Neue Terminanfrage von ${name}`,

      text: `
Neue Terminanfrage

Name: ${name}
E-Mail: ${email}
Telefon: ${telefon}
Wunschtermin: ${datum}
      `
    });

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({
      erfolg: true,
      id: data.id
    });

  } catch (fehler) {
    console.error(
      "Fehler beim E-Mail-Versand:",
      fehler
    );

    return res.status(500).json({
      fehler: "E-Mail konnte nicht gesendet werden."
    });
  }
}