import chromium = require('chrome-aws-lambda');
import puppeteer = require('puppeteer');
import fs = require('fs');
import {stringify} from "querystring";

export interface PdfService {
    getPdf(url: string): Promise<Buffer>;
}

export interface HtmlToPdfService {
    postHtml(html: string): Promise<Buffer>
}

export class ChromeHtmlToPdfService implements HtmlToPdfService {
    public async postHtml(html: string): Promise<Buffer> {
        let document = await Buffer.from(html, 'base64').toString('utf8');
        fs.writeFile('/tmp/content.html', document, function (err)  {
            console.log(`Failed to create tmp file`);
            return
        });

        let browser = null;
        try {
            console.log(`Launching puppeteer browser`);
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });

            const page = await browser.newPage();

            const response = await page.goto('file:///tmp/content.html', {
                waitUntil: 'networkidle0',
            });

            console.log(`Response ${stringify(response)}`);
            await page.setContent((await response.buffer()).toString('utf8'));
            await page.evaluateHandle('document.fonts.ready');

            const result = await page.pdf({
                printBackground: true,
                format: 'A4',
                displayHeaderFooter: false,
                margin: {top: '0.5cm', left: '0cm', right: '0cm', bottom: '0.5cm'},
            });

            return result
        } catch (error) {
            throw new Error(`Failed to PDF for content.html Error: ${JSON.stringify(error)}`);
        } finally {
            if (browser !== null) {
                await browser.close();
            }
        }
    };
}


export class ChromePdfService implements PdfService {
    public async getPdf(url: string): Promise<Buffer> {
        console.log(`Generating PDF for ${url}`);

        let browser = null;
        try {
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });

            const page = await browser.newPage();

            await page.goto(url, {
                waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
            });
            const result = await page.pdf({
                printBackground: true,
                format: 'A4',
                displayHeaderFooter: false,
            });
            console.log(`buffer size = ${result.length}`);
            return result;
        } catch (error) {
            throw new Error(`Failed to PDF url ${url} Error: ${JSON.stringify(error)}`);
        } finally {
            if (browser !== null) {
                await browser.close();
            }
        }
    }
}
