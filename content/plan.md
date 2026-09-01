# Themen- und Stilplan

Antwort auf zwei offene Fragen: **welches Thema** und **welche Looks innerhalb
des Designs**. Beides als Empfehlung, nicht als Auswahlmenü.

---

## Teil 1: Das Thema

### Das falsche Auswahlkriterium

Die naheliegende Frage ist „welches Thema interessiert die Leute?". Das ist
die falsche Frage. Schau auf die Zahlen des Referenzvideos:

| | |
|---|---|
| Likes | 17.700 |
| **Saves** | **5.105** |

Das sind **29 % Saves auf Likes**. Zum Vergleich: bei Unterhaltungscontent
liegt das Verhältnis typisch bei 2–5 %. Dieses Video wird nicht gemocht, es
wird **weggespeichert**. Niemand speichert etwas Interessantes. Man speichert
etwas, von dem man weiß: **das brauche ich nochmal.**

Das richtige Kriterium ist also nicht Interesse, sondern:

> Wird jemand das speichern, weil er es in zwei Wochen wieder braucht?

Und Instagram belohnt genau das. Saves und Sends sind im Ranking stärker
gewichtet als Likes, weil sie schwerer zu faken sind.

### Die Formel dahinter

Das Referenzvideo macht immer dasselbe:

1. Es nimmt eine Verwechslung, die viele mit sich herumtragen
2. bei der man sich **leicht schämt**, sie nicht zu kennen
3. die man aber **täglich braucht**
4. und löst sie in unter einer Minute vollständig auf.

„Git und GitHub sind nicht dasselbe" trifft alle vier Punkte. Deine ersten
beiden Videos auch — Agent vs. Chatbot und Context Window sind exakt dieselbe
Bauart. **Das Konzept steht schon, es muss nur konsequent fortgesetzt werden.**

### Die Nische: KI-Grundbegriffe, die jeder benutzt und keiner erklärt bekommt

Nicht „KI-Tools", nicht „KI-News", nicht „Prompt-Tipps". Sondern die
**Begriffsebene darunter** — das Vokabular, das in jedem Tool auftaucht und
nirgends erklärt wird.

Warum genau diese Ebene:

- **Sie veraltet nicht.** Ein Video über GPT-5 ist in vier Monaten Müll. Ein
  Video über Tokens gilt auch 2028 noch. Das ist entscheidend, weil Reels
  monatelang nachlaufen — ein Video, das nach acht Wochen noch stimmt,
  sammelt weiter Saves ein.
- **Sie ist scham-besetzt.** Genau der Motor des Referenzvideos. Leute
  benutzen täglich das Wort „Token" und trauen sich nicht zu fragen.
- **Sie ist endlich.** Es gibt vielleicht 25 solcher Begriffe. Danach ist die
  Serie fertig — und du hast eine abgeschlossene, wertvolle Playlist statt
  eines Contentflusses, der nie aufhört.
- **Sie ist deutsch unbesetzt.** Auf Englisch ist das gesättigt. Auf Deutsch
  gibt es dazu fast nichts in diesem Format.

### Warum nicht die Alternativen

**Tool-Reviews** („die 5 besten KI-Tools") — höchste Reichweite, niedrigste
Saves. Austauschbar, veraltet in Wochen, und du konkurrierst mit Accounts, die
Affiliate-Budget haben.

**KI-News** — zwingt zu Tagesrhythmus. Bei deiner Produktionskette (Skript →
Voiceover → Messen → Rendern) ist das nicht durchhaltbar, und ein verspätetes
News-Reel ist wertlos.

**Prompt-Listen** — werden gespeichert und nie wieder geöffnet. Instagram sieht
den Save, aber der Kanal baut keine Bindung auf, weil man nichts *versteht*.

### Die ersten zehn

Jedes Video korrigiert genau einen Irrtum. Reihenfolge ist bewusst: die
stärksten Verwechslungen zuerst.

| # | Titel | Der Irrtum | Der konkrete Nutzen danach |
|---|---|---|---|
| 1 | **Agent vs. Chatbot** ✅ | „Ein Agent ist ein Chatbot mit besserem Prompt" | Man erkennt, wann ein Tool wirklich handelt |
| 2 | **Context Window** ✅ | „Die KI hat ein schlechtes Gedächtnis" | Man weiß, wann ein neuer Chat fällig ist |
| 3 | **Tokens** | „Ich zahle pro Wort" | Man versteht die eigene Rechnung |
| 4 | **Halluzination** | „Die KI hat einen Fehler gemacht" | Man weiß, wo Nachprüfen Pflicht ist |
| 5 | **System-Prompt** | „Ich muss meine Regeln jedes Mal wiederholen" | Regeln landen dort, wo sie bleiben |
| 6 | **RAG vs. Fine-Tuning** | „Ich brauche ein eigenes Modell für meine Daten" | Spart im Zweifel fünfstellig |
| 7 | **Temperature** | „Die KI antwortet zufällig" | Man macht Ausgaben reproduzierbar |
| 8 | **Embeddings** | „Suche findet Wörter" | Man versteht, warum sinngemäße Suche trifft |
| 9 | **Reasoning-Modelle** | „Das teure Modell ist immer besser" | Man zahlt nur, wenn Denken nötig ist |
| 10 | **MCP** | „Die KI kann meine Dateien sehen" | Man weiß, was ein Tool wirklich erreicht |

Nummer 3 als nächstes. Tokens ist der Begriff, bei dem der Irrtum am
teuersten ist — man zahlt sichtbar Geld für etwas, das man falsch versteht.
Und es ist das visuell dankbarste Thema: ein Wort, das vor der Kamera in
Stücke zerfällt.

---

## Teil 2: Die Looks

### Das Prinzip

Der Rahmen bleibt **immer identisch**: warmer Hintergrund `#EFEBE2`,
Mono-Schrift, Maskottchen links unten, Kapitelzeile oben. Das ist die
Wiedererkennung, und die darf nie variieren — genau daran erkennt man im
Feed, dass das Video von dir ist, bevor der Ton anspringt.

Die Abwechslung entsteht **ausschließlich auf der Bühne rechts** (`LAYOUT.stage`,
ab x=340). Dort wechselt der Bautyp pro Szene.

Das ist auch die Antwort auf deine Frage nach den Videos von `rick.theengineer`:
Ich kann seinen Account nicht crawlen — Instagram ist vom Netzwerk-Proxy
blockiert (`EGRESS_BLOCKED`) und würde ohnehin Login verlangen. **Wenn du mir
seine Videos hier reinschickst, lese ich die Looks daraus ab.** Bis dahin ist
die Liste unten aus dem einen Video abgeleitet, das ich gesehen habe, plus dem,
was das bestehende Design trägt.

### Die Bautypen

**Bereits gebaut** (in `src/scenes.tsx` und `src/context/scenes.tsx`):

| Typ | Was es zeigt | Wofür |
|---|---|---|
| `Irrtum` | Durchgestrichene Behauptung → Wahrheit darunter | Jeder Hook |
| `Vergleich` | Zwei Karten nebeneinander, eine grün, eine rot | „A ist nicht B" |
| `Schleife` | Pfeile im Kreis, Schritt für Schritt | Abläufe, Agenten |
| `Kasten` | Behälter, der sich füllt und oben überläuft | Grenzen, Kapazität |
| `Tokens` | Wort zerfällt in eingefärbte Stücke | Zerlegung |
| `Kosten` | Zahlen, die hochlaufen | Preis, Menge |
| `Tipps` | Nummerierte Zeilen, einzeln eingeblendet | Immer der Schluss |

**Inzwischen gebaut** — die vier Typen, die der Themenplan braucht:

| Typ | Was es zeigt | Gebraucht für |
|---|---|---|
| `Terminal` | Falsches Chat-/Konsolenfenster mit tippendem Cursor | System-Prompt, MCP |
| `Waage` | Zwei Seiten mit Kosten/Nutzen gegeneinander | RAG vs. Fine-Tuning, Reasoning |
| `Streuung` | Derselbe Prompt, drei verschiedene Antworten | Temperature, Halluzination |
| `Landkarte` | Punkte im Raum, nahe Punkte = ähnliche Bedeutung | Embeddings |

Alle vier sind gebaut und in `videos/katalog.json` zu sehen. Reine
React-Bauteile, kein neues Asset — kosten also **nichts** außer Renderzeit. Die Maskottchen-Posen sind schon alle vier da und werden
weiterverwendet.

### Die Regel für neue Typen

Ein neuer Bautyp kommt nur dazu, wenn ein bestehender das Thema **falsch**
zeigen würde. Nicht zur Abwechslung. Vier bis fünf wiederkehrende Typen sind
ein Format; zwölf sind ein Sammelsurium, und der Zuschauer erkennt nichts
wieder.

---

## Was als nächstes passiert

1. **Video 3 (Tokens)** — Skript, Voiceover (~17 Cent), Zeiten messen, rendern
2. **Bautyp `Terminal`** — wird ab Video 5 gebraucht, lohnt sich vorher
3. **Profilbild** neu erzeugen als echtes Portrait (`account/profilbild-neu-generieren.md`)
4. Ab Video 3 den **Hook-Musterplan** aus `hooks.md` mitprotokollieren
