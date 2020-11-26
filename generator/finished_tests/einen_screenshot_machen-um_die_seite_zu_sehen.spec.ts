import * as puppeteer from 'puppeteer';

describe('einen Screenshot machen', () => {
  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
    });
  });

  it('Der Nutzer kann einen Screenshot machen', async (done: DoneFn) => {
    await page.goto('http://localhost:4200');
    await page.screenshot({ path: 'example.png' });
    browser.close().then(done());
  });
});
