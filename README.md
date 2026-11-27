# KÜS Prüfstelle Website

**Hinweis:** Diese README enthält die wichtigsten Informationen und eine allgemeine Beschreibung des Projekts. Die Bearbeitung und Dokumentation aller Übungs- und Hausaufgaben befindet sich in [AUFGABEN.md](./AUFGABEN.md).

## Projektbeschreibung

Im August 2026 wurde im Rahmen einer Prüforganisation der KÜS eine Kfz-Prüfstelle eröffnet. Da bisher noch keine eigene Website vorhanden ist, wird im Rahmen des Moduls Web Engineering an der DHBW eine Website für die Prüfstelle entwickelt.

Das Projekt verbindet die im Studium erlernten Web-Technologien mit einem konkreten praktischen Anwendungsfall. Die Website soll Kunden einen schnellen Überblick über die angebotenen Prüfleistungen, Kontaktmöglichkeiten und Möglichkeiten zur Terminvereinbarung geben.

## Funktionen

Die Website bietet derzeit folgende Inhalte und Funktionen:

- Übersicht über die angebotenen Prüfleistungen
- Informationen zur Terminvereinbarung
- Formular für eine Online-Terminanfrage
- Kontaktinformationen, Anschrift und Öffnungszeiten
- Informationsseite für ein zukünftiges Benutzerprofil

## Live-Demo

Die veröffentlichte Website ist unter folgender Adresse erreichbar:

GitHub: https://dariaottenbacher.github.io/KUES-Pruefstelle-Website/

Vercel: https://kues-pruefstelle-website-nslp.vercel.app/index.html

## Geplante Inhalte

Im weiteren Verlauf des Projekts soll eine Online-Terminreservierung umgesetzt werden. Kunden sollen dabei eine verfügbare Dienstleistung auswählen und einen Termin buchen können.

Zusätzlich soll das Benutzerprofil zukünftig die Verwaltung von Kontakt- und Fahrzeugdaten ermöglichen.

## Datenquelle

Für die Website werden mehrere externe Dienste verwendet:

### OpenStreetMap und Leaflet

Für die Standortkarte werden Kartendaten von OpenStreetMap verwendet. Die Adresse der Prüfstelle wird über geografische Koordinaten auf einer interaktiven Leaflet-Karte dargestellt. Dafür ist kein geheimer API-Key erforderlich.

### The News API

Auf der Startseite werden aktuelle Nachrichten zu Themen wie Hauptuntersuchung, Abgasuntersuchung, Oldtimer und Fahrzeugprüfung über The News API geladen.

Die Anfrage an die News-API erfolgt serverseitig über die Vercel-Funktion `/api/news`. Der benötigte API-Key wird aus Sicherheitsgründen nicht im Frontend oder im GitHub-Repository gespeichert, sondern als Environment Variable `NEWS_API_TOKEN` in Vercel hinterlegt.

### Resend

Für die Online-Terminanfrage wird Resend verwendet. Nach dem Absenden des Formulars werden die eingegebenen Kontaktdaten und der gewünschte Termin über die Vercel-Funktion `/api/termin` an Resend übergeben und anschließend per E-Mail versendet.

Der hierfür benötigte API-Key wird ebenfalls nicht im Quellcode gespeichert, sondern als Environment Variable `RESEND_API_KEY` in Vercel hinterlegt.

Weitere Informationen zur Umsetzung befinden sich in [AUFGABEN.md](./AUFGABEN.md).

## Lokale Ausführung

Für die lokale Ausführung werden Git, Node.js und npm benötigt.

### 1. Repository klonen

```bash
git clone https://github.com/DariaOttenbacher/KUES-Pruefstelle-Website.git
```

### 2. In den Projektordner wechseln

```bash
cd KUES-Pruefstelle-Website
```

### 3. Abhängigkeiten installieren

```bash
npm install
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Anschließend kann die Website über die im Terminal angezeigte lokale Adresse geöffnet werden. Standardmäßig verwendet Vite häufig folgende Adresse:

```text
http://localhost:5173/
```

## Verwendete Technologien

## Verwendete Technologien

- HTML5
- CSS3
- Tailwind CSS
- JavaScript
- Vite
- Git und GitHub
- GitHub Actions
- Vercel
- Vercel Serverless Functions
- Leaflet
- OpenStreetMap
- The News API
- Resend

## Geplante Erweiterungen

Die Website könnte später um zusätzliche Funktionen erweitert werden:

- Kundenregistrierung
- HU/AU-Erinnerung per E-Mail oder Post
- Verwaltung von Terminen
- Online-Bewerbungen
- Upload von Lebensläufen und Bewerbungsunterlagen

## KI-Log

Im Projekt wurde KI unterstützend eingesetzt, unter anderem für:

- Erklärungen zu HTML, CSS, JavaScript und APIs
- Fehlersuche und Überprüfung von bestehendem Code
- Verbesserung der Fehlerbehandlung bei API-Anfragen
- Unterstützung bei der Umsetzung von `localStorage` und Caching
- Überprüfung und Verbesserung der Projektdokumentation

Die vorgeschlagenen Änderungen wurden vor der Übernahme geprüft und an die bestehende Projektstruktur angepasst.

Weitere Informationen zum KI-Log sowie dokumentierte Fehler und Korrekturen befinden sich in [AUFGABEN.md](./AUFGABEN.md) unter **Übungsblatt 6 – A5**.

## Screenshot

![Leistungen-Seite der KÜS Prüfstelle Website](<images/Screenshot Leistungen-1.png>)

## Dokumentation der Aufgaben

Die Bearbeitung und Dokumentation aller Aufgaben befindet sich in der Datei [AUFGABEN.md](./AUFGABEN.md).


## Team

- Daria Ottenbacher