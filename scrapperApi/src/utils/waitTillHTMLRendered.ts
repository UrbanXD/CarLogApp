import { Page } from "puppeteer-core";

export const waitTillHTMLRendered = async (page: Page, timeout = 30000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while(checkCounts++ <= maxChecks) {
        const html = await page.content();
        const currentHTMLSize = html.length;

        if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) {
            countStableSizeIterations++;
        } else {
            countStableSizeIterations = 0; //reset the counter
        }

        if(countStableSizeIterations >= minStableSizeIterations) break; // Page fully rendered

        lastHTMLSize = currentHTMLSize;
        await new Promise((r) => setTimeout(r, checkDurationMsecs));
    }
};
