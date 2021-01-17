import * as puppeteer from 'puppeteer';
import * as assert from 'assert';

describe('das Profil meiner Einrichtung bearbeiten können', () => {
  let browser;
  let page;
  const startURL = 'http://localhost:4200/profiles/edit-profile';
  let currentURL: string;

  beforeEach(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1920,
      deviceScaleFactor: 1,
    });
    currentURL = 'http://localhost:4200/profiles/edit-profile';
    await page.goto('http://localhost:4200/profiles/edit-profile');
    await page.waitForSelector('.acceptButton:nth-of-type(2)');
    await page.click('.acceptButton:nth-of-type(2)');
  });

  it('Der Nutzer erhält ein Formular', async (done: DoneFn) => {
    if ((await page.$('form')) !== null) {
      console.log('found form with name editProfileForm');
      assert.strictEqual(true, true);
    } else {
      console.log('form with name editProfileForm not found');
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Der Nutzer kann das Formular absenden', async (done: DoneFn) => {
    // TODO: implement testing code for filling out form
    await page.click('button.submit-button');
    await browser.close().then(() => done());
  });

  it('Der Nutzer erhält eine Erfolgsmeldung', async (done: DoneFn) => {
    // TODO: Implement interaction that leads to success message
    try {
      await page.waitForSelector('snack-bar-container');
      const snackbar = await page.$$('snack-bar-container');
      if (snackbar.innerHTML.includes('erfolgreich')) {
        assert.strictEqual(true, true);
      } else {
        assert.strictEqual(false, true);
      }
    } catch (error) {
      console.error('snackbar didnt appear', error);
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Der Nutzer kann Tags eingeben', async (done: DoneFn) => {
    // TODO: Please write test for acceptence criteria: Der Nutzer kann Tags eingeben
    await browser.close().then(() => done());
  });

  it('Absendung des Formulars führt zur Anlage des Profils', async (done: DoneFn) => {
    // TODO: Please write test for acceptence criteria: Absendung des Formulars führt zur Anlage des Profils
    await browser.close().then(() => done());
  });

  it('Der Nutzer kann das Profil veröffentlichen', async (done: DoneFn) => {
    // TODO: Please write test for acceptence criteria: Der Nutzer kann das Profil veröffentlichen
    await browser.close().then(() => done());
  });

  it('Der Nutzer erhält eine Vorschau', async (done: DoneFn) => {
    if ((await page.$('div.preview')) !== null) {
      console.log('found div with name preview');
      assert.strictEqual(true, true);
    } else {
      console.log('div with name preview not found ');
      assert.strictEqual(false, true);
    }
    await browser.close().then(() => done());
  });

  it('Der Nutzer kann das Profil speichern', async (done: DoneFn) => {
    // TODO: Please write test for acceptence criteria: Der Nutzer kann das Profil speichern
    await browser.close().then(() => done());
  });
});
