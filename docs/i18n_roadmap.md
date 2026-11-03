# Roadmap: Meertaligheid & Regionale Energie-Adviseur (`/advies`)

## Status & Doelstelling
De senior-vriendelijke adviseurpagina ([`https://hems-cfo-dashboard.vercel.app/advies`](https://hems-cfo-dashboard.vercel.app/advies)) is momenteel geoptimaliseerd voor Vlaanderen (Fluvius capaciteitstarief, Belgische kWh-standaarden en Vlaamse energieleveranciers).

Met de lancering van Open HEMS en de community-adapters voor buurlanden, wordt de adviseur uitgebreid met meertaligheid en regiospecifieke logica:

### 1. Talen & Doelregio's
- **Nederlands (Vlaanderen - `nl-BE`)**: Huidige standaard (Capaciteitstarief, Fluvius, Mega/Engie/Ecopower).
- **Nederlands (Nederland - `nl-NL`)**: Netbeheerders (Enexis/Liander/Stedin), salderingsregeling & terugleverkosten.
- **Français (`fr-BE` / `fr-FR`)**: Wallonië & Brussel (CWaPE/Brugel, tarif capacitaire) en Frankrijk (Enedis, tarif bleu).
- **Deutsch (`de-DE`)**: Duitsland (§14a EnWG, netverzwaring, dynamische tarieven).

### 2. Technische Implementatie
- Lokalisatie via Next.js locale routing of lichte client-side translation dictionary (`i18n.json`).
- Automatische switch van tariefstructuur op basis van landkeuze (bv. saldering vs. capaciteitstarief).
