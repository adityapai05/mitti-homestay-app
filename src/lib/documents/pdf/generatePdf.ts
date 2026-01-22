import { getBrowser } from "./chromium";

export async function generatePdf(html: string) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setContent(
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Poppins, Arial, sans-serif;
        background: #F4F1E1;
      }
    </style>
  </head>
  <body>${html}</body>
</html>`,
    { waitUntil: "networkidle0" },
  );

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "24px",
      bottom: "24px",
      left: "24px",
      right: "24px",
    },
  });

  await browser.close();
  return pdf;
}
