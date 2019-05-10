"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer");
const fs = require("fs");
const querystring_1 = require("querystring");
class ChromeHtmlToPdfService {
    postHtml(html) {
        return __awaiter(this, void 0, void 0, function* () {
            let document = yield Buffer.from(html, 'base64').toString('utf8');
            fs.writeFile('/tmp/content.html', document, function (err) {
                console.log(`Failed to create tmp file`);
                return;
            });
            let browser = null;
            try {
                console.log(`Launching puppeteer browser`);
                browser = yield puppeteer.launch({
                    args: chromium.args,
                    defaultViewport: chromium.defaultViewport,
                    executablePath: yield chromium.executablePath,
                    headless: chromium.headless,
                });
                const page = yield browser.newPage();
                const response = yield page.goto('file:///tmp/content.html', {
                    waitUntil: 'networkidle0',
                });
                console.log(`Response ${querystring_1.stringify(response)}`);
                yield page.setContent((yield response.buffer()).toString('utf8'));
                yield page.evaluateHandle('document.fonts.ready');
                const result = yield page.pdf({
                    printBackground: true,
                    format: 'A4',
                    displayHeaderFooter: false,
                    margin: { top: '0.5cm', left: '0.5cm', right: '0.5cm', bottom: '0.5cm' },
                });
                return result;
            }
            catch (error) {
                throw new Error(`Failed to PDF for content.html Error: ${JSON.stringify(error)}`);
            }
            finally {
                if (browser !== null) {
                    yield browser.close();
                }
            }
        });
    }
    ;
}
exports.ChromeHtmlToPdfService = ChromeHtmlToPdfService;
class ChromePdfService {
    getPdf(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Generating PDF for ${url}`);
            let browser = null;
            try {
                browser = yield puppeteer.launch({
                    args: chromium.args,
                    defaultViewport: chromium.defaultViewport,
                    executablePath: yield chromium.executablePath,
                    headless: chromium.headless,
                });
                const page = yield browser.newPage();
                yield page.goto(url, {
                    waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
                });
                const result = yield page.pdf({
                    printBackground: true,
                    format: 'A4',
                    displayHeaderFooter: false,
                });
                console.log(`buffer size = ${result.length}`);
                return result;
            }
            catch (error) {
                throw new Error(`Failed to PDF url ${url} Error: ${JSON.stringify(error)}`);
            }
            finally {
                if (browser !== null) {
                    yield browser.close();
                }
            }
        });
    }
}
exports.ChromePdfService = ChromePdfService;
//# sourceMappingURL=pdf-service.js.map