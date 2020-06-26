const fs = require('fs');
const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // const MODAL_BUTTON_SELECTOR = '.modal-footer > button';
  // const SEARCH_SELECTOR = 'input[placeholder=Search]';
  // const LOCATION_SELECTOR = 'li.active > a';

  const NEXT_BUTTON = '.pager-next > a';
  const KWDIKOS_THESIS = '.views-field-field-proclam-id > .field-content';
  const TITLE_SELECTOR = '.views-field-title';
  const PERIGRAFH = '.views-field-field-proclam-description > .field-content';
  const SUBJECT = '.views-field-field-proclam-subj-name > .field-content';
  const INSTITUTION = '.views-field-field-proclam-dep-inst-name > .field-content';
  const SCHOOL = '.views-field-field-proclam-dep-school > .field-content';
  const DEPARTMENT = '.views-field-field-proclam-dep-dep > .field-content';
  const FEK = '.views-field-field-proclam-fek > .field-content > a';
  const START_DATE = '.views-field-field-proclam-opendate > .field-content';
  const END_DATE = '.views-field-field-proclam-closedate > .field-content';
  const STATUS = '.views-field-field-proclam-status > .field-content';

  await page.goto('https://apella.minedu.gov.gr/prokhryksh');

  const results = [];
  let hasNext = await page.$(NEXT_BUTTON);;
  let counter = 0;
  try {
while (hasNext) {
  try {
    await page.waitForSelector(NEXT_BUTTON);
    hasNext = await page.$(NEXT_BUTTON);
  } catch (e) {
    hasNext = null;
  }

  for(let i = 1; i <= 20; i++) {
    const RESULTS_SELECTOR = `.views-row-${i}`;
    await page.waitForSelector(`${RESULTS_SELECTOR}`);
    const code = await page.$(KWDIKOS_THESIS);
    const title = await page.$(TITLE_SELECTOR);
    const description = await page.$(PERIGRAFH);
    const subject = await page.$(SUBJECT);
    const institution = await page.$(INSTITUTION);
    const school = await page.$(SCHOOL);
    const department = await page.$(DEPARTMENT);
    const fek = await page.$(FEK);
    const start = await page.$(START_DATE);
    const end = await page.$(END_DATE);
    const status = await page.$(STATUS);
    results.push({
      code: (await code.evaluate(element => element.innerText)) || ((counter * 20) + i),
      title: await title.evaluate(element => element.innerText),
      description: await description.evaluate(element => element.innerText),
      subject: await subject.evaluate(element => element.innerText),
      institution: await institution.evaluate(element => element.innerText),
      school: await school.evaluate(element => element.innerText),
      department: await department.evaluate(element => element.innerText),
      fek: await fek.evaluate(element => element.getAttribute('href')),
      start: await start.evaluate(element => element.innerText),
      end: await end.evaluate(element => element.innerText),
      status: await status.evaluate(element => element.innerText),
    })
  }
  counter++;
  await page.goto(`https://apella.minedu.gov.gr/prokhryksh?page=${counter}`);

}
} catch (e) {
  console.log('SOMETHING WENT WRONG OR FINISHED')
}
 
  console.log('RESULTS: ', results)
  fs.writeFileSync('./results.json', JSON.stringify(results, null, 2));

  // await page.screenshot({path: 'example.png'});

  await browser.close();
})();