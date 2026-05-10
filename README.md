---

## Követelmények / Célok

Egy olyan applikáció lefejlesztése, melyben a felhasználók virtuálisan is kezelni tudják autóikat és az azokhoz
kapcsolódó fontos információkat és ezekkel kapcsolatos statisztikákhoz is hozzáférjenek.

Alap Funkciók:

* Felhasználó kezelés
* Autó kezelés
* Kilométeróra kezelés
* Tankolások kezelése
* Egyéb kiadások kezelése
* Szervizek kezelése
* Útak, utazások kezelése
* Statisztika generálás

---

## Projektstruktúra

```text
src/                  # forráskód
scripts/              # CI/CD szkriptek
supabase/             # adatbázis
.template.env         # titkok nélküli környezeti változó minta
README.md             # projekt alap leírása és futtatási útmutató
```

---

## AI használat

* Chat-GPT és Gemini
* ötletelés, mint logikai, mint funkcionalitást tekintve, azaz legjobb módok a megvalósításra (nem kódgenerálás) és,
  hogy mi illene az apphoz
* képernyőtervek generálása és ötletelés, valamint szöveg generálás magyarul és angolul egyaránt, illetve színséma
  legenerálása
* tesztadatok generálása
* dokumentáció

---

## Architektúra

A rendszer **Local-first** szemléletben épül fel, ahol a React Native kliens egy helyi SQLite adatbázissal kommunikál,
amelyet a PowerSync tart szinkronban a Supabase backenddel.

| Szolgáltatás / Keretrendszer | Réteg                 | Indoklás                                                                                           |
|:-----------------------------|:----------------------|:---------------------------------------------------------------------------------------------------|
| **Supabase és Postgres**     | Backend               | Skálázható relációs adatbázis beépített RLS védelemmel és Auth-szolgáltatással és gyors fejlesztés |
| **Powersync**                | Szinkronizációs réteg | Offline-first képesség biztosítása és komplex szinkronizációs logika kiszervezése                  |
| **React Native és Expo**     | Frontend              | Keresztplatformos mobilfejlesztés egyetlen kódbázissal, jól dokumentált                            |

## Biztonság

* Kysely és React Hook Form, illetve zod sémák az adatok validálásáért és biztonságos használata sql lekérdezésbe
* Supabase szinten RLS szabályok általi védelem illetéktelen adat használathoz
* Supabase egyéb beépített biztonsági szolgáltatásai és szabványai, illetve a jogosultságkezelés
* Powersync szinkronizációs szabályai

---

## Adatmodell

| Táblanév                | Leírás                            |
|:------------------------|:----------------------------------|
| **car**                 | Járművek alapadatai               |
| **currency**            | Pénznemek adatai                  |
| **expense**             | Általános költségek és kiadások   |
| **expense_type**        | Költségkategóriák definíciója     |
| **fuel_log**            | Tankolási bejegyzések             |
| **fuel_tank**           | Üzemanyagtartály adatok           |
| **fuel_type**           | Üzemanyag típusok                 |
| **fuel_unit**           | Üzemanyag mértékegységek          |
| **make**                | Autómárkák (Gyártók)              |
| **model**               | Autómodellek                      |
| **odometer_change_log** | Óraállás módosítások előzményei   |
| **odometer_log**        | Kilométeróra állások rögzítése    |
| **odometer_log_type**   | Óraállás bejegyzések típusai      |
| **odometer_unit**       | Távolság mértékegységek (km/mi)   |
| **passenger**           | Utasok nyilvántartása             |
| **place**               | Helyszínek nyilvántartása         |
| **ride_expense**        | Utazásokhoz kapcsolt költségek    |
| **ride_log**            | Utazási/Útnyilvántartási napló    |
| **ride_passenger**      | Utazáson résztvevő utasok         |
| **ride_place**          | Utazás érintett helyszínei        |
| **service_item**        | Szerviz során felhasznált tételek |
| **service_item_type**   | Szerviztételek kategóriái         |
| **service_log**         | Szerviz események naplója         |
| **service_type**        | Szervizelés típusai               |
| **user_account**        | Felhasználói profilok és fiókok   |

---

## Hogyan futtasd a projektet

---

### Mi kell hozzá?

* Szükséges egy andoird eszköz vagy egy
  emulator (https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=android&device=simulated)
* Jól beállított `.env` fájl a `.template.env` fájl alapján

### Környezeti változók (Environment Variables)

Az alkalmazás futtatásához szükséges `.env` változók listája és magyarázata:

| Név                            | Mire való                                    | Példa / Érték                 |
|:-------------------------------|:---------------------------------------------|:------------------------------|
| **SUPABASE_ACCESS_TOKEN**      | Személyes token a Supabase kezeléséhez       | *Supabase CLI-ből*            |
| **SUPABASE_PUBLISHABLE_KEY**   | Nyilvános kulcs a kliens oldali kérésekhez   | `eyJhbGciOiJIUzI1...`         |
| **SUPABASE_URL**               | A projekt egyedi API címe                    | `https://xyz.supabase.co`     |
| **SUPABASE_SECRET_KEY**        | Admin kulcs szerver oldali műveletekhez      | *xyz*                         |
| **SUPABASE_ATTACHMENT_BUCKET** | A képek/fájlok tároló mappája a storageban   | `attachments`                 |
| **SUPABASE_SEED_BUCKET**       | Az alapadatok tároló mappája a storageban    | `seed-data`                   |
| **SEND_EMAIL_HOOK_SECRET**     | Email webhook hitelesítési kód               | *egyedi azonosító*            |
| **RESEND_API_KEY**             | Resend email szolgáltató API kulcsa          | `re_123456789...`             |
| **POWERSYNC_URL**              | Offline szinkronizációs szerver címe         | `https://xyz.powersync.com`   |
| **MAIN_DATABASE_NAME**         | A helyi fő adatbázis fájlneve                | `carlog_main.sqlite`          |
| **SEED_DATABASE_NAME**         | Az alapértelmezett adatbázis fájlneve        | `carlog_global.sqlite`        |
| **GOOGLE_WEBCLIENTID**         | Google OAuth bejelentkezési azonosító        | `123...googleusercontent.com` |
| **LOCAL_STORAGE_KEY_...**      | Local Storage-ban tárolt beállítások kulcsai | `Carlog_AppLanguage`          |
| **LOCAL_IMAGE_CLEANUP_...**    | Képtakarítás időzítése (ms-ban)              | `86400000` (24h)              |

---

# Development módban a futtatás

1. **Dependency-k letöltése:**
   ```bash
   npm i --force
   ```
2. **Elinditás:**
   ```bash
   npx expo run:android
   ```

---