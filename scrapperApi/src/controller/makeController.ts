import { Request, Response } from "express";
import { initializeChromium } from "../utils/initalizeChromium";
import CONFIG from "../config/index";
import { waitTillHTMLRendered } from "../utils/waitTillHTMLRendered";
import { scrapeInfiniteScroll } from "../utils/scrapeInfiniteScroll";
import { connectToAmqp } from "../utils/connectToAmqp";
import { Make } from "../model/Make";

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