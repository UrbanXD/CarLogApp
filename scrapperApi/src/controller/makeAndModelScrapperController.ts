import { Request, Response } from "express";
import { initializeChromium } from "../utils/initalizeChromium";
import CONFIG from "../config/index";
import { waitTillHTMLRendered } from "../utils/waitTillHTMLRendered";
import { scrapeInfiniteScroll } from "../utils/scrapeInfiniteScroll";
import { Make } from "../model/Make";
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

    const modelsRawData = await page.$$("table[data-table-type='series'] tbody tr.list_item");
    const { connection, channel } = await connectToAmqp(
        CONFIG.RABBITMQ_URL,
        CONFIG.RABBITMQ_SCRAPER_CAR_MODEL_QUEUE_NAME
    );

    for(const model of modelsRawData) {
        const isHistoric = await model.evaluate((el) => el.getAttribute("data-type") === "historic");
        const modelInfo = await model.$$("td");
        const a = await modelInfo[0].$$("a");

        const modelName = await a[1].evaluate((el) => el.textContent.trim());
        const modelYears = await modelInfo[1].evaluate((el, isHistoric) => {
            const years = el.textContent.trim().split("-");
            return {
                startYear: years[0].trim(),
                endYear: isHistoric && years[1].trim() === "" ? years[0].trim() : years[1].trim()
            };
        }, isHistoric);

        const data: Model = {
            makeId,
            name: modelName,
            startYear: modelYears.startYear,
            endYear: modelYears.endYear
        };

        channel.sendToQueue(
            CONFIG.RABBITMQ_SCRAPER_CAR_MODEL_QUEUE_NAME,
            Buffer.from(JSON.stringify(data)),
            { persistent: true }
        );
    }

    await browser.close();
    await channel.close();
    await connection.close();
    res.status(201).json({ message: "Sikeres" });
};

export const scrapeMakes = async (_req: Request, res: Response) => {
    try {
        const browser = await initializeChromium();
        const page = await browser.newPage();
        await page.goto(CONFIG.SCRAPER_CAR_MAKES_URL, { waitUntil: "networkidle2" });

        await waitTillHTMLRendered(page);
        await scrapeInfiniteScroll(page);

        const makeRawData = await page.$$(".brand_list .brand_item");
        const { connection, channel } = await connectToAmqp(
            CONFIG.RABBITMQ_URL,
            CONFIG.RABBITMQ_SCRAPER_CAR_MAKE_QUEUE_NAME
        );

        for(let i = 0; i < makeRawData.length; i++) {
            if(i == 3) break;
            const car = makeRawData[i];

            const makeName = await car.$eval("a.brand_name", (el) => el.textContent.trim());

            const data: Make = { name: makeName };

            channel.sendToQueue(
                CONFIG.RABBITMQ_SCRAPER_CAR_MAKE_QUEUE_NAME,
                Buffer.from(JSON.stringify(data)),
                { persistent: true }
            );

        }
        await channel.close();
        await connection.close();
        res.status(201).json({ message: "Sikeres" });
    } catch(e) {
        console.error("Error  scrap cars make route", e);
    }
};