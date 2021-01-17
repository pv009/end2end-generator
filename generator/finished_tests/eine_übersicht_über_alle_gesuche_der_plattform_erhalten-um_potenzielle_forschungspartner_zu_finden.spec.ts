import * as puppeteer from 'puppeteer';
import * as assert from 'assert';

describe('eine Übersicht über alle Gesuche der Plattform erhalten', () => {
  let browser;
  let page;
  const startURL = 'http://localhost:4200/cards/list/cards';
  let currentURL: string;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
    });
    currentURL = 'http://localhost:4200/cards/list/cards';
    await page.goto('http://localhost:4200/cards/list/cards');
    await page.waitForSelector('.acceptButton:nth-of-type(2)');
    await page.click('.acceptButton:nth-of-type(2)');
  });

  it('Der Nutzer kann ein Einzelgesuch ausklappen, um alle Daten zu sehen', async (done: DoneFn) => {
    await page.click('.fullview-button:first-of-type');
    await browser.close().then(() => done());
  });

  it('Es werden pro Seite mind. 5 Ergebnisse gezeigt', async (done: DoneFn) => {
    const quantity = (await page.$$('.singleCardContainer')).length;
    console.log('quantity: ', quantity);
    if (quantity >= 5) {
      assert.strictEqual(true, true);
    } else {
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Ein Ergebnis enthält mindestens den Titel', async (done: DoneFn) => {
    if ((await page.$('.text-infos>h2')) !== null) {
      console.log('found element with selector: .text-infos>h2');
      assert.strictEqual(true, true);
    } else {
      console.log('could not find element with selector: .text-infos>h2');
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Der Nutzer kann ein Ergebnis anklicken und kommt auf die Detailseite', async (done: DoneFn) => {
    await page.click('.card-image:first-of-type');
    if (page.url() !== currentURL) {
      console.log('URL switched to' + page.url());
      currentURL = page.url();
    } else {
      console.error('page url didnt switch');
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Der Nutzer erhält ein Suchformular', async (done: DoneFn) => {
    if ((await page.$('form.search-form')) !== null) {
      console.log('found form with name search-form');
      assert.strictEqual(true, true);
    } else {
      console.log('form with name search-form not found ');
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Der Nutzer kann zwischen den Seiten navigieren', async (done: DoneFn) => {
    await page.click('button.pageNumber');
    await browser.close().then(() => done());
  });
});
