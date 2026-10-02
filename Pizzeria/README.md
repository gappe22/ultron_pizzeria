# Forno del Vicolo

Sito vetrina responsive per una pizzeria, realizzato con HTML, CSS, JavaScript e **PHP** per il backend.

## Funzionalità

- **Header fisso** con navigazione responsive e menu hamburger su mobile
- **Hero** full-screen con immagine e call-to-action
- **Numeri** — banda con statistiche animate
- **La nostra storia** — sezione chi siamo con foto
- **Offerte del mese** — card con prezzi e badge
- **Menu completo** con tab (Pizze, Antipasti, Dolci, Bevande) e pulsanti aggiungi al carrello
- **Galleria** con lightbox (click per ingrandire, navigazione con frecce/tastiera)
- **Recensioni** clienti con valutazioni
- **Carrello asporto** — aggiunta/rimozione articoli, calcolo totale, ordine inviato al backend PHP
- **Form prenotazione** — validazione live lato client + salvataggio lato server con PHP
- **Mappa Google Maps** integrata nella sezione contatti
- **Footer** con icone social (Instagram, Facebook, TikTok)
- **Pannello admin** per consultare prenotazioni e ordini

## Avvio locale

Il progetto usa PHP per le prenotazioni e gli ordini. Avvia un server PHP con:

```sh
php -S localhost:8000
```

Apri <http://localhost:8000>. Per fermare il server, premi `Ctrl+C` nel terminale.

> Se hai solo bisogno della parte statica (senza prenotazioni/ordini), puoi anche usare `python3 -m http.server 8000`.

## File

| File | Descrizione |
|---|---|
| `index.html` | Homepage: hero, storia, offerte, menu, galleria, recensioni, carrello, prenotazione |
| `styles.css` | Palette, tipografia, layout responsive, lightbox e mappa |
| `script.js` | Menu mobile, scroll reveal, tab menu, carrello, form, lightbox |
| `prenota.php` | API — riceve le prenotazioni (POST JSON), salva in CSV |
| `ordine.php` | API — riceve gli ordini asporto (POST JSON), valida prezzi lato server, salva in CSV |
| `admin.php` | Pannello admin protetto da password per consultare prenotazioni e ordini |
| `data/` | Cartella creata automaticamente con `prenotazioni.csv` e `ordini.csv` |

## Pannello admin

Accedi a <http://localhost:8000/admin.php> con:

- **Utente:** `admin`
- **Password:** `vicolo2024`

⚠️ Cambia le credenziali nel file `admin.php` prima di pubblicare.

## Prima della pubblicazione

- Aggiorna nome, indirizzo, telefono, email, orari, piatti e prezzi in `index.html`
- Aggiorna i prezzi anche in `ordine.php` (array `$PRICES`)
- Cambia le credenziali admin in `admin.php`
- Le fotografie si caricano da Unsplash e i caratteri da Google Fonts (serve connessione Internet)
- Aggiungi i link reali ai social nel footer (`index.html`)
