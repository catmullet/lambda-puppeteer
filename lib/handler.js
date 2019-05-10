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
const pdf_service_1 = require("./pdf-service");
const pdf_service_2 = require("./pdf-service");
const pdfService = new pdf_service_1.ChromePdfService();
const htmlService = new pdf_service_2.ChromeHtmlToPdfService();
module.exports.pdfReport = (event, context, callback) => __awaiter(this, void 0, void 0, function* () {
    console.log(`pdfReport request ${JSON.stringify(event, null, 4)}`);
    const url = event.query.url;
    const buffer = yield pdfService.getPdf(url);
    callback(null, buffer.toString('base64'));
});
module.exports.htmlToPdf = (event, context, callback) => __awaiter(this, void 0, void 0, function* () {
    console.log(`htmlToPdf request ${JSON.stringify(event, null, 4)}`);
    console.log(event.body);
    console.log(event.body.htmlbase64);
    const buffer = yield htmlService.postHtml(event.body.htmlbase64);
    callback(null, { pdfbase64: buffer.toString('base64') });
});
//# sourceMappingURL=handler.js.map