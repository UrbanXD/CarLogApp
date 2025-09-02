import { Page } from "puppeteer-core";

export const scrapeInfiniteScroll = async (page: Page, scrollDelay = 1000, maxScrolls = 500) => {
   let previousHeight;
   let currentScrolls = 0;

   while (currentScrolls < maxScrolls) {
      try {
         // Scroll to the bottom of the page
         previousHeight = await page.evaluate("document.body.scrollHeight");
         await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");

         previousHeight = await page.evaluate("document.body.scrollHeight");
         await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
         await page.waitForFunction(`document.body.scrollHeight >= ${previousHeight}`);
         await new Promise((resolve) => setTimeout(resolve, scrollDelay));

         // Check the current scroll height
         const newHeight = await page.evaluate("document.body.scrollHeight");
         if (newHeight === previousHeight) break;

         currentScrolls++;
      } catch (error) {
         console.error("Error during scrolling:", error);
         break;
      }
   }
};
