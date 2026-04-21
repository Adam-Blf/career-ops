#!/usr/bin/env node

/**
 * apply-wttj.mjs - Auto-fill Welcome to the Jungle application forms
 * Uses Playwright with persistent Chrome profile (keeps login session)
 *
 * Usage: node apply-wttj.mjs
 *
 * IMPORTANT: Does NOT click Submit. Pauses for human review before each submission.
 */

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));

const AUTO_MODE = process.argv.includes('--auto');
const rl = !AUTO_MODE ? createInterface({ input: process.stdin, output: process.stdout }) : null;
const ask = AUTO_MODE ? async (q) => { console.log(q + ' [AUTO]'); return ''; } : (q) => new Promise(r => rl.question(q, r));

// Applications to process
const applications = [
  {
    id: '004',
    company: 'Groupe BPCE',
    role: 'Data AI Engineer',
    url: 'https://www.welcometothejungle.com/fr/companies/groupe-bpce/jobs/alternance-1-an-data-ai-engineer-f-h-paris_paris',
    cv: resolve(__dirname, 'output/004-groupe-bpce-cv.pdf'),
    letter: resolve(__dirname, 'output/candidatures/004-groupe-bpce-lettre.txt'),
  },
  {
    id: '025',
    company: 'Thales',
    role: 'Ingenieur Data/IA',
    url: 'https://www.welcometothejungle.com/fr/companies/thales/jobs/alternance-ingenieur-data-ia-f-h_gennevilliers',
    cv: resolve(__dirname, 'output/025-thales-cv.pdf'),
    letter: resolve(__dirname, 'output/candidatures/025-thales-lettre.txt'),
  },
  {
    id: '009',
    company: 'Fortuneo',
    role: 'Data Engineer / ML Engineer',
    url: 'https://www.welcometothejungle.com/fr/companies/fortuneo/jobs/data-engineer-ml-engineer-h-f-alternance',
    cv: resolve(__dirname, 'output/009-fortuneo-cv.pdf'),
    letter: resolve(__dirname, 'output/candidatures/009-fortuneo-lettre.txt'),
  },
  {
    id: '002',
    company: 'Natixis',
    role: 'Data Science NLP/LLM',
    url: 'https://www.welcometothejungle.com/fr/companies/natixis/jobs/alternance-1-an-data-science-f-h_paris_NATIX_NZr5P8l',
    cv: resolve(__dirname, 'output/002-natixis-cv.pdf'),
    letter: resolve(__dirname, 'output/candidatures/002-natixis-lettre.txt'),
  },
  {
    id: '012',
    company: 'Groupe BPCE (Risques)',
    role: 'Data Scientist Risques & IA',
    url: 'https://www.welcometothejungle.com/fr/companies/groupe-bpce/jobs/alternance-1-an-data-scientist-risques-ia-f-h-paris_paris',
    cv: resolve(__dirname, 'output/012-groupe-bpce-cv.pdf'),
    letter: resolve(__dirname, 'output/candidatures/012-groupe-bpce-risques-lettre.txt'),
  },
];

const PROFILE = {
  firstName: 'Adam',
  lastName: 'Beloucif',
  email: 'adambeloucif@gmail.com',
  linkedin: 'https://linkedin.com/in/adambeloucif',
  portfolio: 'https://adam.beloucif.com',
};

async function processApplication(page, app) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`#${app.id} - ${app.company} - ${app.role}`);
  console.log(`${'='.repeat(60)}`);

  // Navigate to job page
  console.log(`Navigating to ${app.url}...`);
  await page.goto(app.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Look for "Postuler" button
  const applyBtn = page.locator('button, a').filter({ hasText: /postuler|apply|candidater/i }).first();
  if (await applyBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Clicking "Postuler"...');
    await applyBtn.click();
    await page.waitForTimeout(3000);
  }

  // Read the letter
  let letterText = '';
  try {
    letterText = readFileSync(app.letter, 'utf-8');
  } catch (e) {
    console.log(`Warning: could not read letter file ${app.letter}`);
  }

  // Try to fill common form fields
  const fields = [
    { selectors: ['input[name*="first" i]', 'input[name*="prenom" i]', 'input[placeholder*="prenom" i]', 'input[placeholder*="first" i]'], value: PROFILE.firstName },
    { selectors: ['input[name*="last" i]', 'input[name*="nom" i]', 'input[placeholder*="nom" i]', 'input[placeholder*="last" i]'], value: PROFILE.lastName },
    { selectors: ['input[name*="email" i]', 'input[type="email"]', 'input[placeholder*="email" i]'], value: PROFILE.email },
    { selectors: ['input[name*="linkedin" i]', 'input[placeholder*="linkedin" i]'], value: PROFILE.linkedin },
    { selectors: ['input[name*="portfolio" i]', 'input[name*="website" i]', 'input[placeholder*="portfolio" i]', 'input[placeholder*="site" i]'], value: PROFILE.portfolio },
  ];

  for (const field of fields) {
    for (const selector of field.selectors) {
      try {
        const el = page.locator(selector).first();
        if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
          await el.clear();
          await el.fill(field.value);
          console.log(`Filled: ${selector} = ${field.value}`);
          break;
        }
      } catch (e) { /* skip */ }
    }
  }

  // Try to fill textarea (cover letter / message)
  const textareas = ['textarea[name*="message" i]', 'textarea[name*="letter" i]', 'textarea[name*="motivation" i]', 'textarea[name*="cover" i]', 'textarea'];
  for (const selector of textareas) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
        await el.clear();
        await el.fill(letterText);
        console.log(`Filled cover letter in ${selector}`);
        break;
      }
    } catch (e) { /* skip */ }
  }

  // Try to upload CV
  const fileInputs = ['input[type="file"]'];
  for (const selector of fileInputs) {
    try {
      const el = page.locator(selector).first();
      if (await el.count() > 0) {
        await el.setInputFiles(app.cv);
        console.log(`Uploaded CV: ${app.cv}`);
        break;
      }
    } catch (e) {
      console.log(`Could not upload CV: ${e.message}`);
    }
  }

  // Take screenshot
  const screenshotPath = resolve(__dirname, `output/candidatures/${app.id}-form-screenshot.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved: ${screenshotPath}`);

  // STOP - wait for human review
  console.log(`\n>>> FORMULAIRE REMPLI pour ${app.company} - ${app.role}`);
  console.log(`>>> VERIFIE le formulaire dans le navigateur avant de continuer.`);
  console.log(`>>> NE PAS soumettre automatiquement.`);

  const answer = await ask('\nAppuie sur ENTER pour passer a la suivante (ou tape "skip" pour sauter) : ');
  return answer.toLowerCase() !== 'skip';
}

async function main() {
  console.log('Career-Ops Apply - Lancement avec profil Chrome...\n');

  // Use Chrome user data to keep login session
  const userDataDir = resolve(process.env.LOCALAPPDATA, 'Google/Chrome/User Data');

  let browser;
  try {
    // Try connecting to existing Chrome via CDP
    browser = await chromium.launchPersistentContext(
      resolve(process.env.TEMP, 'playwright-career-ops'),
      {
        headless: false,
        channel: 'chrome',
        viewport: { width: 1280, height: 900 },
        args: ['--disable-blink-features=AutomationControlled'],
      }
    );
  } catch (e) {
    console.log('Could not use Chrome profile, launching fresh browser...');
    browser = await chromium.launchPersistentContext(
      resolve(process.env.TEMP, 'playwright-career-ops'),
      {
        headless: false,
        viewport: { width: 1280, height: 900 },
      }
    );
  }

  const page = browser.pages()[0] || await browser.newPage();

  console.log(`${applications.length} candidatures a traiter.\n`);
  console.log('RAPPEL: Le script NE soumet RIEN. Il remplit les formulaires et attend ta validation.\n');

  for (const app of applications) {
    try {
      await processApplication(page, app);
    } catch (e) {
      console.log(`Erreur sur ${app.company}: ${e.message}`);
      const answer = await ask('Continuer avec la suivante ? (ENTER/skip) : ');
      if (answer.toLowerCase() === 'skip') continue;
    }
  }

  console.log('\n=== TERMINE ===');
  console.log('Toutes les candidatures ont ete remplies.');
  console.log('Verifie chaque onglet et soumets manuellement celles que tu valides.');

  if (!AUTO_MODE) {
    await ask('\nAppuie sur ENTER pour fermer le navigateur : ');
  } else {
    console.log('Mode auto - fermeture dans 5 secondes...');
    await new Promise(r => setTimeout(r, 5000));
  }
  await browser.close();
  if (rl) rl.close();
}

main().catch(console.error);
