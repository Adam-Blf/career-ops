# Campagne candidatures alternance M2 - checkpoint du 2026-07-28

Session interrompue par la limite d'usage 5h (reset vers 19h50 Paris).
Ce fichier suffit a reprendre sans rien reexpliquer.

## Contexte fige

- Install career-ops reelle : `C:/Users/adamb/Documents/dev/community/career-ops`, **v1.23.0**.
  `C:/Users/adamb/career-ops` est un fossile vide.
- Template par defaut : `ats` (une page, noir et blanc), defini dans `config/profile.yml`.
- Procedure standing en 7 etapes : voir `modes/_custom.md` et `~/.claude/CLAUDE.md` section 12.
- gsheet : `1pRfRsaqaaG4ExVoSj38fJ63jv0QvPia3bg6E_RQE2pA`, mise a jour via Chrome.
  Piege : entrer en mode edition (F2) avant de taper un premier caractere accentue.
- Livrables : `C:/Users/adamb/Desktop/Alternance M2 Data Engineering IA/{Entreprise} - {Poste} ({Ville})/`
- **Adam clique Envoyer et coche les consentements lui-meme. Toujours.**

## Fait

- [x] career-ops 1.3.0 -> 1.23.0 (resync complet depuis un clone frais, l'updater n'avait copie que 40 fichiers sur 843)
- [x] `templates/cv-template.ats.html` + `templates/cover-letter-template.ats.html`
- [x] `modes/_profile.md` reecrit avec les archetypes reels d'Adam (etaient encore ceux de santifer)
- [x] `modes/_custom.md` cree
- [x] `ralph.py` repare (ROOT pointait sur le dossier vide) + prompt aligne sur le template ats et le dossier Bureau
- [x] 4 rapports orphelins (005-008) rattrapes dans le tracker local
- [x] **009 CND** 4.5/5 - envoyee - tracker Applied - gsheet Envoye - relance 2026-08-07
- [x] **010 Hermes** 4.6/5 - envoyee par Adam - tracker Applied - gsheet Envoye - relance 2026-08-07
- [x] **011 Numberly** 4.3/5 - envoyee - tracker Applied - gsheet Envoye - relance 2026-08-07
- [x] **012 CHANEL** 4.3/5 - dossier pret, formulaire Workday non soumis

## En cours

- [ ] **CHANEL** : cliquer Apply sur `cc.wd3.myworkdayjobs.com` (JOBREQ00110224), deposer
      `Adam-Beloucif-CV-CHANEL-MLOps.pdf` et `Adam-Beloucif-LM-CHANEL-MLOps.pdf`.
      Le slug de l'URL dit "Data Engineer" mais le titre reel de la requisition est bien
      "Assistant Ingenieur ML/IA, MLOps et LLMOps" : le ciblage MLOps du CV est le bon.
      Points a clarifier : demarrage annonce **octobre 2026** (M2 demarre en septembre), et
      gap TDD assume dans la lettre.
- [x] **L'Oreal** : tranche le 2026-07-28 par Adam lui-meme, l'offre est bien **fermee**.
      Il parlait de CHANEL quand il disait "je suis connecte". La ligne gsheet reste
      "Ecarte (offre fermee)". Rien a produire.

## Etat au 2026-07-29 (reprise)

- [x] **012 CHANEL** : candidature envoyee par Adam le 2026-07-29 via Workday
      (JOBREQ00110224). Tracker `Applied`, gsheet ligne 8 en `Envoye`, relance 2026-08-08.
- [x] **013 Hitachi Rail** 4.3/5 : offre verifiee vivante sur careers.hitachi.com
      (req R1013149, republiee le 2026-07-23) - le miroir Indeed la dit expiree a tort.
      CV + LM ATS une page generes, dossier Bureau livre, rapport 013 ecrit,
      tracker `Evaluated`, gsheet ligne 9 corrigee (vraie URL + note).
- [x] **013 Hitachi Rail** : candidature soumise par Adam le 2026-07-29 via Workday
      (req R1013149). Tracker `Applied`, gsheet ligne 9 en `Envoye`, relance 2026-08-08.

Piege gsheet (2026-07-29) : les coordonnees d'ecran derivent entre deux captures
(le viewport alterne 1568 et 1280), donc un clic direct sur une cellule peut
tomber sur une autre ligne. Toujours passer par la zone de nom (Name Box),
verifier par capture que la reference affichee est la bonne, puis taper. Un
Ctrl+Z de reparation annule aussi les modifications legitimes precedentes,
il faut les ressaisir.

- [ ] **Hitachi Rail, formulaire Workday** : rempli jusqu'a l'etape 3 sur 6
      (donnees perso, experience avec 3 postes + 2 formations + 3 sites web,
      CV et LM deposes, questions 1/2 sauf le consentement RGPD).
      Consentement RGPD valide par Adam. Adresse complete saisie
      (6 impasse Edouard Vaillant, Chevilly-Larue 94550). Question salaire remplie
      (grille legale alternance). Formulaire arrete a l'etape 5 sur 6.
      Etape 2 completee a fond : domaines d'etudes (Data Science / Communication),
      moyennes (15,04/20 master, 13,66/20 licence), attestation
      "Career Essentials in Generative AI by Microsoft and LinkedIn", 3 langues
      (francais 5/5, anglais 4/5, espagnol 4/5), 6 aptitudes (Python, langage
      relationnel SQL, outils ETL, entrepot de donnees, Oracle Database, Linux).
      **Reste a Adam** : re-cocher "J'ai lu et j'accepte les conditions generales"
      (l'aller-retour dans le formulaire la decoche), puis Reviser et Soumettre.
      Diplome saisi = `FR MASTERE TECHNIQUE` (pas de `Master M2` dans la liste Workday).

Piege Workday : les listes deroulantes valident l'element surligne des qu'on
appuie sur Entree, et les refs d'accessibilite pointent souvent sur le bloc
precedent. Toujours cliquer la ligne voulue dans la liste, puis verifier par
capture d'ecran avant d'enchainer.

Piege du jour : le dossier Bureau `Hitachi Rail - Data Platform ETL (Velizy-Villacoublay)`
existait deja avec des CV/LM du 2026-07-24. Les anciens sont dans `archive-2026-07-24/`.
Toujours verifier l'existence du dossier avant de le creer.

## Reste a traiter, par score

| Offre | Score | Portail | Compte |
|---|---|---|---|
| Hitachi Rail, Data Platform ETL (Velizy 78) | 4.3 | Indeed | anti-bot rencontre |
| ChapsVision, Data Engineer (Paris) | 4.2 | WTTJ | fait |
| Safran Aircraft Engines, Apprenti Data Engineer (Melun 77) | 4.2 | WTTJ puis Safran | Safran a creer |
| Groupe BPCE, Data Engineer Hadoop/GCP (Charenton 94) | 4.1 | WTTJ | fait |
| Fortuneo, Data Engineer (Courbevoie 92) | 4.1 | WTTJ | fait |
| Culligan, Apprenti Data Engineer BI (Versailles 78) | 4.1 | WTTJ | fait |
| Valeo, Junior Data Scientist (Cergy 95) | 4.0 | LinkedIn puis portail | a voir |
| Credit Agricole CIB, Ingenieur Data et IA (Montrouge 92) | 4.0 | WTTJ | fait |
| Safran Aircraft Engines, Data Analyst Supply Chain MRO (Moissy 77) | 4.0 | Safran | formulaire deja ouvert par Adam |

## Ecartees le 2026-07-28, liveness verifiee

- **Thales** Data/AI Engineer Meudon (4.4) : HTTP 410
- **AS International Group** Ingenieur IA (4.2) : "ne recoit plus de candidatures"
- **L'Oreal** (4.5) : a reverifier, voir ci-dessus

## Sans lien exploitable

- **Leasecom** et **Loamics** : le gsheet ne contient qu'une URL de recherche Indeed, pas l'offre
- **GRDF** : aucun lien
- **Bouygues Telecom** x4 : offres du 2026-04-22, plus de 3 mois, a considerer mortes sauf verification

## Lecons de la session

1. L'updater `update-system.mjs` ne copie qu'une partie des fichiers. Apres tout update, verifier
   avec `node verify-pipeline.mjs` et resyncer depuis un clone frais si un module manque.
2. Fermer la modale d'un formulaire ATS vide tout le formulaire (constate sur CND). Ne jamais
   scroller hors de la modale avant d'avoir fini.
3. Dans Google Sheets, un premier caractere accentue tape dans une cellule non editee est perdu.
4. `check-liveness.mjs` en lot produit des courses de navigation Playwright et beaucoup de
   "uncertain" qui ne sont pas des offres mortes. Verifier une par une dans Chrome.
5. Les offres d'alternance data en IDF se ferment en quelques jours. Traiter le jour meme.
