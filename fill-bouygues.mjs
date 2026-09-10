#!/usr/bin/env node
// Tailored CV + LM HTML builder for Bouygues Telecom offers (ref 525, 709, 536)
// Generates /tmp/*.html then caller pipes through generate-pdf.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const TEMPLATE = readFileSync('templates/cv-template.html', 'utf8');
const OUT_DIR = 'output';
mkdirSync(OUT_DIR, { recursive: true });

const PROFILE = {
  name: 'Adam Beloucif',
  phone: '+33 7 86 46 68 34',
  email: 'adam.beloucif@efrei.net',
  linkedin_url: 'https://linkedin.com/in/adambeloucif',
  linkedin_display: 'linkedin.com/in/adambeloucif',
  portfolio_url: 'https://adam.beloucif.com',
  portfolio_display: 'adam.beloucif.com',
  location: 'Paris, Ile-de-France',
};

const SHARED_EXPERIENCE = `
<div class="job avoid-break">
  <div class="job-header">
    <div>
      <div class="role-title">Ingenieur PMSI / Data Engineer</div>
      <div class="company-name">Groupe Hospitalier Fondation Vallee - Paul Guiraud (GHT Sud Paris)</div>
    </div>
    <div class="dates">Sept. 2025 - Present (Alternance)</div>
  </div>
  <ul class="bullets">
    {{EXP_FV_BULLETS}}
  </ul>
</div>

<div class="job avoid-break">
  <div class="job-header">
    <div>
      <div class="role-title">Charge de communication digitale</div>
      <div class="company-name">EPSM Lille-Metropole - GHT Psy NPdC</div>
    </div>
    <div class="dates">Dec. 2024 - Sept. 2025 (Alternance)</div>
  </div>
  <ul class="bullets">
    <li>Refonte de l'ecosysteme digital du GHT Psy NPdC, analyse fonctionnelle et specifications</li>
    <li>Creation de KPI et tableaux de bord pour le suivi des performances</li>
    <li>Methodologie projet avec documentation, suivi regulier et iterations</li>
  </ul>
</div>

<div class="job avoid-break">
  <div class="job-header">
    <div>
      <div class="role-title">Assistant Scrum Master</div>
      <div class="company-name">BNP Paribas</div>
    </div>
    <div class="dates">Mai 2023 - Juil. 2023 (Stage)</div>
  </div>
  <ul class="bullets">
    <li>Animation ceremonies Scrum (Daily, Sprint Planning, Review, Retro) en univers risk &amp; finance</li>
    <li>Suivi velocity, burndown, taux de completion, escalade des blocages</li>
  </ul>
</div>
`;

const EDUCATION = `
<div class="edu avoid-break">
  <div class="edu-header">
    <div>
      <div class="degree">Master Data Engineering &amp; IA (Bac+5, RNCP niveau 7)</div>
      <div class="school">EFREI - Paris-Panthéon-Assas</div>
    </div>
    <div class="dates">Sept. 2025 - Juil. 2027 (Alternance)</div>
  </div>
  <div class="edu-detail">Data Lakes, Data Mesh, AWS/Azure/GCP, Hadoop/Spark/Databricks, ETL Airflow, Kubernetes, Kafka, ML/DL, MLOps, RGPD</div>
</div>
<div class="edu avoid-break">
  <div class="edu-header">
    <div>
      <div class="degree">Bachelor International Communication &amp; Technology (Bac+3, RNCP niveau 6)</div>
      <div class="school">EFREI x ISIT (double diplome, 180 ECTS)</div>
    </div>
    <div class="dates">Sept. 2022 - Juil. 2025</div>
  </div>
  <div class="edu-detail">Gestion projet Agile, marketing digital (SEO/SEA/SMO), UX/UI, front-end, communication interculturelle</div>
</div>
<div class="edu avoid-break">
  <div class="edu-header">
    <div>
      <div class="degree">Erasmus - Communication &amp; production audiovisuelle</div>
      <div class="school">Universidad de Malaga (Espagne)</div>
    </div>
    <div class="dates">Sept. 2023 - Fev. 2024</div>
  </div>
</div>
`;

const CERTIFICATIONS = `
<ul class="bullets">
  <li>Microsoft Azure Fundamentals (AZ-900) - en preparation (avril 2026)</li>
  <li>Microsoft Azure AI Fundamentals (AI-900) - en preparation (avril 2026)</li>
  <li>Career Essentials in Generative AI - Microsoft, Oct. 2025</li>
  <li>HubSpot Inbound - Mars 2024</li>
  <li>Certificat Pix - Mars 2022</li>
</ul>
`;

const SKILLS_BASE = `
<div class="skills-grid">
  <div><strong>Langages :</strong> Python, SQL, PL-SQL, PHP, TypeScript/JavaScript, C#, C++</div>
  <div><strong>Data Engineering :</strong> Oracle, PostgreSQL, MongoDB, BigQuery, ETL/ELT, Airflow, Docker, CI/CD</div>
  <div><strong>Cloud &amp; Big Data :</strong> GCP, Azure, AWS, Hadoop, Spark, Databricks, Kafka, Kubernetes</div>
  <div><strong>IA &amp; ML :</strong> Scikit-learn, TensorFlow, PyTorch, LLM fine-tuning, RAG, SBERT, Computer Vision, MLOps</div>
  <div><strong>BI &amp; Visualisation :</strong> Business Objects, Tableau, Streamlit</div>
  <div><strong>Methodes :</strong> Agile/Scrum, DevOps, DataOps, RGPD</div>
  <div><strong>Langues :</strong> Francais (natif), Anglais (C1), Espagnol (C1)</div>
</div>
`;

// Per-offer configs
const OFFERS = [
  {
    slug: 'bouygues-data-analyst-525',
    company: 'Bouygues Telecom',
    role: 'Alternance Data Analyst F/H (Service Client - Prevision & Budget)',
    summary: `Etudiant M2 Data Engineering &amp; IA a l'EFREI, actuellement alternant Data Engineer au Groupe Hospitalier Fondation Vallee (dashboards de pilotage, modeles predictifs d'admissions, flux ETL Oracle). Je recherche une alternance M2 Data Analyst orientee pilotage business et IA applicative, a partir de septembre 2026, rythme 2 semaines entreprise / 1 semaine ecole. Profil hybride tech + communication (double diplome EFREI-ISIT, trilingue FR/EN/ES).`,
    competencies: ['Data Analyst', 'Dashboards &amp; BI', 'SQL / PL-SQL', 'Python', 'Agents IA &amp; LLM', 'Analyse comportement client', 'Qualite des donnees', 'Communication transverse'],
    exp_fv_bullets: `
    <li>Conception et maintenance de <strong>tableaux de bord interactifs</strong> (Business Objects, PMSI-Pilot) pour pilotage medico-economique</li>
    <li>Etudes et analyses quantitatives specifiques pour directions et services cliniques (<strong>analyse comportement utilisateur</strong>, KPIs)</li>
    <li>Modelisation infocentre Oracle et flux ETL/ELT (SQL/PL-SQL), industrialisation via Docker et CI/CD</li>
    <li>Developpement de <strong>modeles predictifs Python</strong> pour anticiper les admissions hospitalieres</li>
    <li>Monitoring de la qualite des donnees, conformite RGPD</li>
    <li>Creation d'une API en PHP pour l'interoperabilite et l'acces securise aux donnees</li>`,
    projects: [
      { name: 'IA Generative Doctis', desc: 'Prototype d\'<strong>agent IA</strong> conversationnel pour aide a la decision (LLM + RAG)' },
      { name: 'Urban Data Explorer', desc: 'Analyse des dynamiques du logement parisien, pipeline data et segmentation Python' },
      { name: 'NLP Similarite Semantique', desc: 'Systeme de similarite semantique avec Sentence-Transformers (SBERT)' },
      { name: 'Sovereign OS', desc: 'Application desktop PMSI utilisee en hopital (Python, PyInstaller)' },
    ],
    lm_hook: `Alternant Data Engineer en sante publique depuis septembre 2025, je maitrise au quotidien la conception de dashboards de pilotage, les flux ETL Oracle et le developpement d'agents IA (LLM + RAG). Rejoindre l'equipe Prevision &amp; Budget de Bouygues Telecom me permettrait d'industrialiser ces competences sur des volumes B2C et d'apporter une lecture double tech + communication, tres utile pour l'adoption des outils.`,
    lm_why_company: `J'ai choisi Bouygues Telecom pour trois raisons. <strong>La maturite data</strong> de votre stack (GCP / BigQuery / Dataiku) permet de travailler sur des pipelines deja industrialises, pas sur des POC. <strong>La diversite des metiers Service Client</strong> (prevision, budget, qualite) offre un terrain riche pour croiser analyse quantitative et comprehension metier. <strong>La culture responsable</strong> du groupe (13,1 mois, interessement, 4 demi-journees bénévolat, RSE) correspond a mes valeurs, nourries par quatre ans de leadership associatif (Vice-Presidence BDE ISIT, 700 etudiants, 40 nationalites).`,
    lm_fit_paragraph: `Concretement, mon parcours colle a la fiche de poste : <strong>2 ans d'alternance Data Engineer</strong> au demarrage en septembre 2026, <strong>experience production</strong> sur dashboards (Business Objects, Streamlit) et modeles ML (predictions d'admissions sur donnees reelles), <strong>appetence marketing</strong> via mon Bachelor EFREI-ISIT (SEO, SEA, UX/UI) et <strong>curiosite IA agent</strong> avec des projets concrets (IA Generative Doctis, NLP SBERT). Mon rythme EFREI M2 (2 semaines entreprise / 1 semaine ecole) s'aligne exactement sur votre besoin.`,
  },
  {
    slug: 'bouygues-developpeur-data-709',
    company: 'Bouygues Telecom',
    role: 'Alternance Developpeur Data F/H (Scoring & Recouvrement)',
    summary: `Etudiant M2 Data Engineering &amp; IA a l'EFREI, alternant Data Engineer au Groupe Hospitalier Fondation Vallee (pipelines ETL Oracle industrialises, modeles ML predictifs, monitoring qualite RGPD). Stack principale Python + SQL, avec GCP/BigQuery en cours de formation M2. Je recherche une alternance M2 Developpeur Data orientee automatisation de processus metier et exploration IA, a partir de septembre 2026.`,
    competencies: ['Python &amp; SQL', 'GCP / BigQuery', 'Pipelines ETL/ELT', 'Flux data industrialises', 'Scoring &amp; anti-fraude', 'Dataiku &amp; Tableau', 'IA appliquee', 'Optimisation performance'],
    exp_fv_bullets: `
    <li>Mise en place de <strong>flux ETL/ELT industrialises</strong> (SQL/PL-SQL, Docker, CI/CD) avec supervision qualite et alerting</li>
    <li>Modelisation et developpement de la base Oracle de l'infocentre hospitalier</li>
    <li>Developpement de <strong>modeles predictifs Python</strong> (scikit-learn) pour anticiper les admissions et detecter anomalies</li>
    <li><strong>Optimisation des performances</strong> SQL (EXPLAIN PLAN, index, refactor requetes > 30s vers < 2s)</li>
    <li>Monitoring qualite des donnees, detection de drift, zero incident remonte sur 6+ mois</li>
    <li>API PHP pour l'interoperabilite securisee, deploiement Docker et Git</li>`,
    projects: [
      { name: 'Projet Data Engineering M1', desc: '<strong>Architecture Medaillon</strong> collaborative, pipelines data distribues (Python)' },
      { name: 'IA Generative Doctis', desc: 'Exploration <strong>IA generative</strong> pour optimisation de processus metier (LLM + RAG)' },
      { name: 'Taskmate', desc: 'Plateforme productivite avec <strong>priorisation ML automatique</strong> (stack MERN + modele predictif)' },
      { name: 'Urban Data Explorer', desc: 'Analyse des dynamiques du logement parisien, pipeline data Python + clustering' },
    ],
    lm_hook: `Alternant Data Engineer en sante publique depuis septembre 2025, j'industrialise au quotidien des <strong>flux ETL SQL/PL-SQL sur Oracle</strong>, avec supervision qualite et modeles predictifs Python. Votre alternance Developpeur Data au sein du service Scoring &amp; Recouvrement combine trois axes qui m'attirent directement : resoudre des problemes concrets de fraude et d'impayes, monter sur une stack moderne GCP/BigQuery/Dataiku, et explorer l'apport de l'IA dans l'automatisation des processus.`,
    lm_why_company: `Bouygues Telecom coche trois cases que je cherche activement. <strong>Une stack data moderne</strong> (GCP, BigQuery, Dataiku, Tableau) que je pratique deja partiellement en formation M2. <strong>Un contexte risk/finance</strong> (scoring, anti-fraude, recouvrement) deja approche lors de mon stage Scrum Master chez BNP Paribas, qui m'a donne le gout des problematiques quantitatives a enjeux financiers. <strong>Un grand groupe francais responsable</strong> avec une politique d'alternance solide (13,1 mois, PEE/PERCO, interessement, 4 demi-journees bénévolat).`,
    lm_fit_paragraph: `Mon profil technique colle a la fiche de poste : <strong>Python et SQL maitrises en production</strong> (pas seulement en projet ecole), <strong>GCP / BigQuery</strong> en cours d'approfondissement dans ma M2 EFREI Data Engineering, <strong>experience flux data industrialises</strong> (Docker, CI/CD, monitoring qualite). Dataiku est l'outil que je n'ai pas encore pratique, mais mon historique de montee en competence rapide (PHP + Oracle + ML appris en 6 mois a la Fondation Vallee) me permet de l'onboarder en moins d'une semaine. Mon rythme EFREI M2 (2 semaines entreprise / 1 semaine ecole) demarre en septembre 2026.`,
  },
  {
    slug: 'bouygues-data-analyst-536',
    company: 'Bouygues Telecom',
    role: 'Alternance Data Analyst F/H (Direction Marketing)',
    summary: `Etudiant M2 Data Engineering &amp; IA a l'EFREI, profil hybride ingenieur data + communication (double diplome EFREI-ISIT, trilingue FR/EN/ES). Alternant Data Engineer au Groupe Hospitalier Fondation Vallee depuis sept. 2025 (dashboards de pilotage, analyses quantitatives, ETL Oracle). Je recherche une alternance M2 Data Analyst orientee marketing quantitatif et IA generative, a partir de septembre 2026.`,
    competencies: ['Data Analyst Marketing', 'SQL avance', 'Segmentation &amp; ciblage client', 'Dashboards BI', 'Analyse quantitative', 'IA generative / GenAI', 'Insights metier', 'Storytelling data'],
    exp_fv_bullets: `
    <li>Conception de <strong>dashboards de pilotage</strong> pour directions et services cliniques (Business Objects, PMSI-Pilot)</li>
    <li><strong>Analyses quantitatives</strong> specifiques pour eclairer les decisions strategiques des directions</li>
    <li><strong>Segmentation</strong> et analyses comportement utilisateur sur donnees infocentre (Oracle, SQL/PL-SQL)</li>
    <li>Traduction des besoins metier en specifications techniques, co-construction avec end users</li>
    <li>Developpement de modeles predictifs Python et monitoring qualite RGPD</li>`,
    projects: [
      { name: 'Urban Data Explorer', desc: '<strong>Segmentation</strong> et analyse des dynamiques du logement parisien (Python, clustering, visualisation)' },
      { name: 'IA Generative Doctis', desc: 'Prototype <strong>IA generative</strong> pour aide a la decision (LLM + RAG)' },
      { name: 'Taskmate', desc: 'Plateforme productivite avec <strong>priorisation ML</strong> (stack MERN + modele predictif)' },
      { name: 'NLP Similarite Semantique', desc: 'Recommandation semantique avec Sentence-Transformers (SBERT, Python)' },
    ],
    lm_hook: `Profil hybride ingenieur data + communication (double diplome EFREI-ISIT, trilingue FR/EN/ES), actuellement alternant Data Engineer en sante publique, je postule a votre alternance Data Analyst Marketing parce qu'elle combine exactement les deux faces de mon parcours : la <strong>rigueur quantitative</strong> (SQL, segmentation, dashboards) et la <strong>comprehension produit/marche</strong> (quatre ans de communication digitale et de leadership associatif international).`,
    lm_why_company: `Trois raisons d'alignement avec Bouygues Telecom. <strong>L'echelle B2C</strong> permet des analyses segmentaires riches sur des volumes consequents, exactement ce qui manque a un contexte sante publique limite. <strong>L'ouverture a la GenAI</strong> mentionnee dans votre offre correspond a mes projets (IA Generative Doctis, NLP SBERT) et a ma certification Microsoft Career Essentials in Generative AI (oct. 2025). <strong>La culture d'integration des alternants</strong> (13,1 mois, PEE/PERCO, CSE, 4 demi-journees bénévolat associatif) correspond a mes valeurs.`,
    lm_fit_paragraph: `Sur le fond, mon profil colle a la fiche de poste : <strong>SQL maitrise en production</strong> (PL-SQL Oracle industrialise a Fondation Vallee), <strong>environnements data divers</strong> (Oracle, PostgreSQL, BigQuery, MongoDB), <strong>appetence marketing reelle</strong> (Bachelor EFREI-ISIT, SEO/SEA/SMO, UX/UI), <strong>rigueur analytique</strong> (monitoring qualite RGPD, zero incident sur 6 mois) et <strong>curiosite IA</strong> avec des projets concrets. Mon <strong>rythme EFREI M2</strong> (2 semaines entreprise / 1 semaine ecole, demarrage septembre 2026) s'aligne sur les rythmes mentionnes dans votre offre.`,
  },
  {
    slug: 'bouygues-data-ia-4g-5g-647',
    company: 'Bouygues Telecom',
    role: 'Alternance Data & IA dimensionnement radio et QoE 4G/5G F/H',
    summary: `Etudiant M2 Data Engineering &amp; IA a l'EFREI, alternant Data Engineer au Groupe Hospitalier Fondation Vallee (pipelines ETL, modeles predictifs, monitoring qualite). Profil oriente Data / Machine Learning / IA generative, avec des projets en <strong>GenAI et prototypage d'agents IA</strong>. Je recherche une alternance M2 R&amp;D combinant data et systemes industriels complexes, a partir de septembre 2026.`,
    competencies: ['Python &amp; SQL', 'Machine Learning', 'GCP / BigQuery / Vertex AI', 'Prototypage GenAI', 'Agents IA', 'Analyse de donnees', 'Vulgarisation pedagogique', 'Curiosite systemes complexes'],
    exp_fv_bullets: `
    <li>Developpement de <strong>modeles predictifs Python</strong> (scikit-learn, XGBoost) pour anticiper les admissions hospitalieres</li>
    <li>Flux ETL/ELT SQL/PL-SQL industrialises, monitoring qualite et alerting temps reel</li>
    <li><strong>Etudes data</strong> specifiques pour directions medicales et services cliniques, vulgarisation des resultats</li>
    <li>Modelisation de l'infocentre Oracle et API PHP pour acces securise aux donnees</li>
    <li>Deploiement Docker + CI/CD, conformite RGPD</li>`,
    projects: [
      { name: 'IA Generative Doctis', desc: 'Prototype d\'<strong>agent IA</strong> conversationnel pour aide a la decision (LLM + RAG)' },
      { name: 'NLP Similarite Semantique', desc: 'Systeme de recommandation avec Sentence-Transformers (SBERT, embeddings)' },
      { name: 'Recipe Reco Frigo', desc: 'Modele <strong>LSTM</strong> de recommandation contextuelle (Python, deep learning)' },
      { name: 'ChessAI Self-Learning', desc: 'Jeu d\'echecs avec IA par <strong>Reinforcement Learning</strong> (Web + Python)' },
    ],
    lm_hook: `Alternant Data Engineer en sante publique depuis septembre 2025, je developpe au quotidien des modeles predictifs Python et explore des prototypes d'agents IA generative (LLM + RAG). Votre alternance Data &amp; IA au sein de la Direction Technique m'attire par son positionnement R&amp;D sur un domaine industriel exigeant · le <strong>dimensionnement radio 4G/5G et la qualite d'experience client</strong>, ou l'apport de la GenAI agentique est encore a defricher.`,
    lm_why_company: `Trois raisons m'orientent vers Bouygues Telecom. <strong>L'echelle industrielle</strong> du reseau mobile offre des volumes data et des contraintes temps reel inedits par rapport a mes terrains precedents. <strong>L'ouverture a la GenAI agentique</strong> mentionnee dans l'offre correspond a mes projets concrets (IA Generative Doctis, NLP SBERT) et a la certification Microsoft Career Essentials in Generative AI (oct. 2025). <strong>La culture grand groupe responsable</strong> (13,1 mois, interessement, 4 demi-journees benevolat, teletravail 2j post-alternance) correspond a mes valeurs, ancrees dans quatre ans de leadership associatif international (Vice-Presidence BDE ISIT).`,
    lm_fit_paragraph: `Je suis conscient que mon profil differe du profil Telecom pur traditionnellement recrute sur ce type de poste. Mon <strong>angle differenciateur</strong> est assume · j'apporte une expertise Data/IA orientee production (Python, SQL, ML, GCP, GenAI) aux cotes des 5 experts radio, plutot qu'une redondance telecom. Mon experience <strong>Preparation Militaire Marine Kieffer</strong> (mention Assez Bien) et mon bachelor ingenieur (EFREI-ISIT) m'ont initie aux systemes de transmission et a la rigueur scientifique. Je suis pret a investir rapidement sur les fondamentaux radio 4G/5G durant les premieres semaines, en complement de ma stack data deja operationnelle.`,
  },
];

function fill(template, map) {
  let out = template;
  for (const [k, v] of Object.entries(map)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

function buildCv(offer) {
  const projectsHtml = offer.projects.map(p => `
<div class="proj avoid-break">
  <div class="proj-header"><strong>${p.name}</strong></div>
  <div class="proj-desc">${p.desc}</div>
</div>`).join('\n');

  const competenciesHtml = offer.competencies
    .map(c => `<span class="competency-tag">${c}</span>`)
    .join('\n      ');

  const experience = SHARED_EXPERIENCE.replace('{{EXP_FV_BULLETS}}', offer.exp_fv_bullets);

  const html = fill(TEMPLATE, {
    LANG: 'fr',
    PAGE_WIDTH: '210mm',
    NAME: PROFILE.name,
    PHONE: PROFILE.phone,
    EMAIL: PROFILE.email,
    LINKEDIN_URL: PROFILE.linkedin_url,
    LINKEDIN_DISPLAY: PROFILE.linkedin_display,
    PORTFOLIO_URL: PROFILE.portfolio_url,
    PORTFOLIO_DISPLAY: PROFILE.portfolio_display,
    LOCATION: PROFILE.location,
    SECTION_SUMMARY: 'Profil',
    SUMMARY_TEXT: offer.summary,
    SECTION_COMPETENCIES: 'Competences cles',
    COMPETENCIES: competenciesHtml,
    SECTION_EXPERIENCE: 'Experience professionnelle',
    EXPERIENCE: experience,
    SECTION_PROJECTS: 'Projets',
    PROJECTS: projectsHtml,
    SECTION_EDUCATION: 'Formation',
    EDUCATION: EDUCATION,
    SECTION_CERTIFICATIONS: 'Certifications',
    CERTIFICATIONS: CERTIFICATIONS,
    SECTION_SKILLS: 'Competences techniques',
    SKILLS: SKILLS_BASE,
  });

  const outPath = path.join(OUT_DIR, `cv-${offer.slug}-2026-04-22.html`);
  writeFileSync(outPath, html, 'utf8');
  return outPath;
}

function buildLm(offer) {
  const today = '22 avril 2026';
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Lettre de motivation - ${PROFILE.name} - ${offer.company}</title>
<style>
  @page { size: A4; margin: 22mm 22mm 22mm 22mm; }
  body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10.5pt; line-height: 1.5; color: #222; max-width: 180mm; margin: 0 auto; }
  .head { display: flex; justify-content: space-between; margin-bottom: 20mm; }
  .sender { font-size: 10pt; line-height: 1.3; }
  .sender strong { font-size: 12pt; color: #003d82; }
  .recipient { font-size: 10pt; line-height: 1.3; text-align: right; }
  .subject { font-weight: bold; margin: 10mm 0 6mm 0; font-size: 11pt; color: #003d82; }
  p { margin: 0 0 4mm 0; text-align: justify; }
  .salutation { margin-bottom: 4mm; }
  .signature { margin-top: 10mm; }
  .signature strong { color: #003d82; }
  strong { color: #003d82; }
</style>
</head>
<body>
<div class="head">
  <div class="sender">
    <strong>${PROFILE.name}</strong><br>
    ${PROFILE.location}<br>
    ${PROFILE.phone}<br>
    ${PROFILE.email}<br>
    ${PROFILE.linkedin_display}
  </div>
  <div class="recipient">
    ${offer.company}<br>
    Service Recrutement<br>
    13 avenue du Marechal Juin<br>
    92360 Meudon-la-Foret<br>
    <br>
    Paris, le ${today}
  </div>
</div>

<div class="subject">Objet : Candidature - ${offer.role} (reference site carrieres)</div>

<p class="salutation">Madame, Monsieur,</p>

<p>${offer.lm_hook}</p>

<p>${offer.lm_why_company}</p>

<p>${offer.lm_fit_paragraph}</p>

<p>Je serais ravi de vous rencontrer pour echanger sur votre besoin et detailler comment mon parcours peut contribuer aux projets de votre equipe. Mon portfolio (<a href="${PROFILE.portfolio_url}">${PROFILE.portfolio_display}</a>) et mon GitHub (<a href="https://github.com/Adam-Blf">github.com/Adam-Blf</a>) presentent les projets cites en complement.</p>

<p>Je vous remercie par avance pour l'attention portee a ma candidature et reste disponible au ${PROFILE.phone} ou par email.</p>

<p class="signature">Cordialement,<br><br><strong>${PROFILE.name}</strong></p>

</body>
</html>`;

  const outPath = path.join(OUT_DIR, `lm-${offer.slug}-2026-04-22.html`);
  writeFileSync(outPath, html, 'utf8');
  return outPath;
}

const results = [];
for (const offer of OFFERS) {
  const cvPath = buildCv(offer);
  const lmPath = buildLm(offer);
  results.push({ slug: offer.slug, cv: cvPath, lm: lmPath });
}
console.log(JSON.stringify(results, null, 2));
