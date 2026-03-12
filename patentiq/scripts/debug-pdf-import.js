const PdfPrinter = require('pdfmake/js/Printer').default;
console.log('PdfPrinter:', PdfPrinter);
try {
    const printer = new PdfPrinter({});
    console.log('Success!');
} catch (e) {
    console.log('Error:', e.message);
}
