# Admin panel - Secretari
# ACS Life - Proiect IP

## Comenzi utile
Poți rula următoarele:
### `yarn`
Instalează toate dependențele proiectului
Dacă nu ai yarn, rulează comanda `npm install -g yarn`

### `yarn start`
Rulează aplicația pe [http://localhost:3000](http://localhost:3000) pentru un preview în browser
Pagina se reîncarcă dacă faci shimbări


### `Informații utile`
Pentru a activa otp intră în fișierul `.env` și schimbă valoarea variabilei de mediu REACT_APP_DISABLE_OTP cu false
Pentru a activa quote feature intră în fișierul `.env` și schimbă valoarea variabilei de mediu REACT_APP_DISABLE_QUOTES cu false
Pentru a activa înregistrarea de conturi de studenți pentru aplicația mobilă la adăugare, setează REACT_APP_STUD_ACC cu true
Dacă ulterior vor fi adăugate variabile de mediu, este strict necesar să respecte convenția de nume `REACT_APP_{nume_variabila}`, altfel nu vor fi detectate.