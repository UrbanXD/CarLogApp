import { Router } from "express";
import { scrapeMakes, scrapeModels } from "../controller/makeAndModelScrapperController";

const router = Router();

// router.get("/scrape", scrapeCars);
router.post("/startMakeScraping", scrapeMakes);
router.post("/startModelScraping/:makeId", scrapeModels);

export default router;