import express from "express";
import CONFIG from "./config/index";
import scrapperRoute from "./routes/scrapperRoute";

const app = express();
app.use(express.json());
app.listen(CONFIG.SCRAPER_API_PORT, () => {
    console.log(`Server is runnsding on port: ${ CONFIG.SCRAPER_API_PORT }`);
});

app.get("/health", (req, res) => res.send("OK"));

app.get("/", (req, res) => {
    res.send("Hello,cfddf TypeScript and Docker! " + JSON.stringify(CONFIG));
});

app.use(scrapperRoute);

export default app;
