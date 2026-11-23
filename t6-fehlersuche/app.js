// Diese Datei enthält fünf Fehler. Finde und behebe sie.
// Regeln: erst selbst suchen, Konsole lesen, dann erst fragen.

const formular = document.querySelector("#formular");
const eingabe = document.querySelector("#halt"); // fehler1 ?? eingabe gibts nicht 
const liste = document.querySelector("#Liste");
const zaehler = document.querySelector("#zaehler");

let haltestellen = [];

formular.addEventListener("submit", (event) => {   // fehler2 sumbit
  event.preventDefault();

  const name = eingabe.value.trim();

  if (name.length === 0) {   // fehler5 =Zuweisung/===Vergleich
    return;
  }

  haltestellen.push(name);

  const liste = document.querySelector("#liste"); // fehler3 эта строчка была пропущена то есть не было указателя на это поле 
  const li = document.createElement("li");
  li.textContent = name;
  liste.appendChild(li);

  zaehler.textContent = haltestellen.length + " Haltestellen"; // fehler4 lenght

  formular.reset();
});
