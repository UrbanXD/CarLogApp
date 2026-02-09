const Database = require("better-sqlite3");
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

async function fetchInBatches(tableName: string) {
    let allData = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

    console.log(`Lekérés indítása: ${ tableName }...`);

    while(hasMore) {
        const to = from + step - 1;
        const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .range(from, to)
        .order("id", { ascending: true }); // A fix sorrend elengedhetetlen a range-nél

        if(error) {
            throw new Error(`Hiba a(z) ${ tableName } lekérésekor: ${ error.message }`);
        }

        if(data && data.length > 0) {
            allData.push(...data);
            console.log(`  -> ${ allData.length } sor letöltve...`);

            // Ha kevesebb jött, mint a limit, akkor az utolsó oldalon vagyunk
            if(data.length < step) {
                hasMore = false;
            } else {
                from += step;
            }
        } else {
            hasMore = false;
        }
    }

    return allData;
}

async function generateSeed() {
    const dbName = process.env.SEED_DATABASE_NAME ?? "carlog_seed_db.sqlite";
    const db = new Database(dbName);

    db.exec(`
        CREATE TABLE IF NOT EXISTS make
        (
            id
            TEXT
            PRIMARY
            KEY,
            name
            TEXT
        );
        CREATE TABLE IF NOT EXISTS model
        (
            id
            TEXT
            PRIMARY
            KEY,
            make_id
            TEXT,
            name
            TEXT,
            start_year
            INTEGER,
            end_year
            INTEGER
        );
    `);
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

    // MAKES lekérése és mentése
    const makes = await fetchInBatches("make");
    if(makes.length > 0) {
        const insert = db.prepare("INSERT OR REPLACE INTO make (id, name) VALUES (@id, @name)");
        const insertMany = db.transaction((rows: any[]) => {
            for(const row of rows) insert.run(row);
        });
        insertMany(makes);
        console.log(`✅ Összesen ${ makes.length } márka elmentve.`);
    }

    // MODELS lekérése és mentése
    const models = await fetchInBatches("model");
    if(models.length > 0) {
        const insert = db.prepare(
            "INSERT OR REPLACE INTO model (id, make_id, name, start_year, end_year) VALUES (@id, @make_id, @name, @start_year, @end_year)"
        );
        const insertMany = db.transaction((rows: any[]) => {
            for(const row of rows) insert.run(row);
        });
        insertMany(models);
        console.log(`✅ Összesen ${ models.length } modell elmentve.`);
    }

    db.close();
    try {
        // 1. Fájl beolvasása a lemezről
        const fileBuffer = fs.readFileSync(dbName);

        // 2. Feltöltés a Supabase Storage-ba
        // Fontos: A 'seeds' bucketnek léteznie kell a Supabase-en!
        const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_SEED_BUCKET)
        .upload(dbName, fileBuffer, {
            contentType: "application/x-sqlite3",
            upsert: true
        });

        if(error) {
            console.error("Hiba a feltöltés során:", error.message);
        } else {
            console.log("✅ Sikeresen feltöltve a Storage-ba:", data.path);
        }
    } catch(err) {
        console.error("Váratlan hiba a fájlkezelésnél:", err);
    }
}

generateSeed().catch(err => {
    console.error(err);
    process.exit(1);
});