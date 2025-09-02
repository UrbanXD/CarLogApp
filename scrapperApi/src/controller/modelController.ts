import { Request, Response } from "express";
import { initializeChromium } from "../utils/initalizeChromium";
import CONFIG from "../config/index";
import { waitTillHTMLRendered } from "../utils/waitTillHTMLRendered";
import { slugify } from "../utils/slugify";
import { Model } from "../model/Model";
import { connectToAmqp } from "../utils/connectToAmqp";

export const scrapeModels = async (req: Request, res: Response) => {
    if(!req.params.makeId || isNaN(Number(req.params.makeId)) || !req.body.makeName) return;

    const makeId = Number(req.params.makeId);
    const url = `${ CONFIG.SCRAPER_CAR_MAKE_MODELS_BASE_URL }/${ slugify(req.body.makeName) }`;

    const browser = await initializeChromium();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    await waitTillHTMLRendered(page);

    await page.$$eval("div.btn_expand", (buttons) => {
        for(const button of buttons) button.click();
    });

    const infoTable = await page.$$("div.row.mb-4.px-2 span.sptitle");

    const modelCount = await infoTable[2].evaluate(el => {
        const count = Number(el.nextSibling?.textContent?.trim());
        return isNaN(count) ? 0 : count;
    });

    const lastModelYear = await infoTable[1].evaluate(el => {
        const yearText = el.nextSibling?.textContent?.trim().split("-")[1];
        const currentYear = new Date().getFullYear();
        const year = yearText === "" ? currentYear : Number(el.nextSibling?.textContent?.trim().split("-")?.[1]);
        return isNaN(year) ? currentYear : year;
    });

    if(lastModelYear < 1970 || modelCount < 1) {
        await browser.close();
        return res.sendStatus(204);
    }

    const modelsRawData = await page.$$("table[data-table-type='series'] tbody tr.list_item");
    const models: Array<Model> = [];

    for(const model of modelsRawData) {
        const isHistoric = await model.evaluate((el) => el.getAttribute("data-type") === "historic");
        const modelInfo = await model.$$("td");
        const a = await modelInfo[0].$$("a");

        const modelName = await a[1].evaluate((el) => el.textContent.trim());

        if(modelName === "Concept") continue;

        const modelYears = await modelInfo[1].evaluate((el, isHistoric) => {
            const years = el.textContent.trim().split("-");
            return {
                startYear: years[0].trim(),
                endYear: isHistoric && years[1].trim() === "" ? years[0].trim() : years[1].trim()
            };
        }, isHistoric);

        models.push({
            makeId,
            name: modelName,
            startYear: modelYears.startYear,
            endYear: modelYears.endYear
        });
    }

    await browser.close();

    if(models.length < 1) return res.sendStatus(204); // NO CONTENT

    const { connection, channel } = await connectToAmqp(
        CONFIG.RABBITMQ_URL,
        CONFIG.RABBITMQ_SCRAPER_CAR_MODEL_QUEUE_NAME
    );

    for(const model of models) {
        channel.sendToQueue(
            CONFIG.RABBITMQ_SCRAPER_CAR_MODEL_QUEUE_NAME,
            Buffer.from(JSON.stringify(model)),
            { persistent: true }
        );
    }

    await channel.close();
    await connection.close();

    res.sendStatus(200); // OK
};