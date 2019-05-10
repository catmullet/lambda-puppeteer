import { ChromePdfService, PdfService } from './pdf-service';
import { ChromeHtmlToPdfService, HtmlToPdfService } from './pdf-service';

const pdfService: PdfService = new ChromePdfService();
const htmlService: HtmlToPdfService = new ChromeHtmlToPdfService();

module.exports.pdfReport = async (event, context, callback) => {
  console.log(`pdfReport request ${JSON.stringify(event, null, 4)}`);
  const url = event.query.url;
  const buffer = await pdfService.getPdf(url);
  callback(null, buffer.toString('base64'));
};

module.exports.htmlToPdf = async (event, context, callback) => {
  console.log(`htmlToPdf request ${JSON.stringify(event, null, 4)}`);
  console.log(event.body);
  console.log(event.body.htmlbase64);
  const buffer = await htmlService.postHtml(event.body.htmlbase64);
  callback(null, {pdfbase64:buffer.toString('base64')});
};
