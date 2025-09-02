import { Router } from "express";
import { scrapeMakes } from "../controller/makeController";
import { scrapeModels } from "../controller/modelController";

const router = Router();

router.post("/startMakeScraping", scrapeMakes);
router.post("/startModelScraping/:makeId", scrapeModels);

export default router;