import chromium from "@sparticuz/chromium-min";
import CONFIG from "../config";
import puppeteer from "puppeteer-core";

export const initializeChromium = async () => {
   chromium.setGraphicsMode = false;

   await chromium.font("https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf");

   return await puppeteer.launch({
      args: chromium.args,
      executablePath: CONFIG.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
      headless: true
   });
};
