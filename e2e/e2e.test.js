import puppeteer from 'puppeteer';
const child_process = require('child_process');

jest.setTimeout(30000);               // default puppeteer timeout

describe('Форма валидации банковских карт', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = child_process.fork(`${__dirname}/e2e.server.js`);
    // await new Promise((resolve, reject) => {
    //   server.on('error', reject);
    //   server.on('message', (message) => {
    //     if (message === 'ok') {
    //       resolve();
    //     }
    //   });
    // });

    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 100,
      // devtools: true,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('Отображение стартовой страницы', async () => {
    await page.goto(baseUrl);
    await page.waitForSelector('.innogrn-form-widget');
  });

  test('Проверка карты на валидность', async () => {
    jest.setTimeout(20000);
    await page.goto(baseUrl);

    await page.waitForSelector('.innogrn-form-widget');

    const form = await page.$('.innogrn-form-widget');
    const input = await form.$('.input');
    const submit = await form.$('.submit');

    await input.type('5399 6240 9791 6063');
    await submit.click();

    await page.waitForSelector('.input.valid');
  });

  test('Проверка карты на невалидность', async () => {
    jest.setTimeout(20000);
    await page.goto(baseUrl);

    await page.waitForSelector('.innogrn-form-widget');

    const form = await page.$('.innogrn-form-widget');
    const input = await form.$('.input');
    const submit = await form.$('.submit');

    await input.type('2022 4613 7816 9764');
    await submit.click();

    await page.waitForSelector('.input.invalid');
  });
});
