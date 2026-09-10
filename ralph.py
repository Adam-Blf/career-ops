"""Ralph loop career-ops - tache planifiee Windows tous les 3 jours.

Sequence d'execution -
1. node scan.mjs - hit portails Greenhouse/Ashby/Lever (zero-token).
2. node check-liveness.mjs - verifie que les offres en pipeline sont actives.
3. claude --print headless - filtre offres alternance M2 FR Data/IA, eval A-G,
   genere CV+LM si score >= 4.0/5, ecrit TSV batch/tracker-additions/.
4. node merge-tracker.mjs + verify-pipeline.mjs.
5. Copie PDFs vers C:/Users/adamb/Documents/ et mise a jour Apprentissages.md.

Invoque directement par Task Scheduler via python.exe (pas de .ps1/.bat,
compat EDR Fondation Vallee).
"""

from __future__ import annotations

import datetime as dt
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"C:/Users/adamb/Documents/Projets/community/career-ops")
DOCS = Path(r"C:/Users/adamb/Documents")
CANDIDATURES_DIR = Path(r"C:/Users/adamb/Documents/candidatures_M2_2026")
VAULT = Path(r"C:/Users/adamb/Documents/Obsidian/Claude")
CLAUDE_EXE = Path(r"C:/Users/adamb/.local/bin/claude.exe")
LOG = ROOT / "ralph.log"

RALPH_PROMPT = """Ralph loop career-ops pass - pipeline alternance M2 2026 Adam Beloucif.

Repertoire de travail - C:/Users/adamb/Documents/Projets/community/career-ops/

Lire d'abord modes/_custom.md et modes/_profile.md - ce sont les regles maison d'Adam et elles priment sur ce prompt.

Etape 1 - Lire data/pipeline.md (vient d'etre rempli par scan.mjs). Filtrer les offres pour ne garder que celles qui matchent TOUS ces criteres -
- **Localisation - Ile-de-France uniquement** - Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94), Val-d'Oise (95), Yvelines (78), Essonne (91), Seine-et-Marne (77). Rejeter systematiquement - tout poste Lyon, Marseille, Toulouse, Nantes, Bordeaux, Lille, Strasbourg, etc. Rejeter aussi tout poste hors France metropolitaine (USA, UK, Suisse, Belgique, remote international).
- Type de contrat - Alternance, Apprentissage, ou mention M2 / Master 2 / 2025 / 2026.
- Metier - Data Engineer, Data Scientist, Data Analyst, ML Engineer, IA / AI Engineer, Data Platform, MLOps, Analytics Engineer. Exclure roles non-data (marketing, sales, legal, customer support).

Note - remote-friendly IDF accepte uniquement si l'entreprise a son siege ou un site IDF et que Adam peut s'y rendre en 1h30 max depuis Chevilly-Larue (94) en transport.

Etape 2 - Pour chaque offre filtree, executer le mode `oferta` de career-ops - evaluation A-G selon modes/_profile.md + modes/fr/offre.md. Produire un rapport dans reports/{num}-{company-slug}-{YYYY-MM-DD}.md avec Blocks A-F + G (Legitimacy).

Etape 3 - Pour toute offre avec score final >= 4.0/5, generer CV + LM personnalises -
- Template impose - `ats` (ATS strict, une page, noir et blanc). C'est le defaut de config/profile.yml, ne pas le surcharger.
- CV - construire le payload JSON puis `node build-cv-html.mjs output/cv-adam-beloucif-{slug}.json output/cv-adam-beloucif-{slug}.html $(node cv-templates.mjs resolve cv)`, puis `node verify-cv-facts.mjs`, puis `node generate-pdf.mjs ... --format=a4 --max-pages=1 --strict-pages --report={num}`.
- Lettre - payload JSON puis `node generate-cover-letter.mjs --payload output/lm-adam-beloucif-{slug}.json --out output/lm-adam-beloucif-{slug}-{date}.pdf --format a4 --report {num}`.
- Structure cible - `C:/Users/adamb/Desktop/Alternance M2 Data Engineering IA/{Entreprise} - {Poste} ({Ville})/` (creer le dossier si absent) avec -
  - `Adam-Beloucif-CV-{Entreprise}-{Poste}.pdf`
  - `Adam-Beloucif-LM-{Entreprise}-{Poste}.pdf`
  - `rapport-evaluation.md` - copie du rapport de reports/.
- Verifier que chaque PDF tient en 1 page stricte via pypdf.
- Mettre a jour `C:/Users/adamb/Desktop/Alternance M2 Data Engineering IA/00-SUIVI.md` avec le nouveau dossier + statut "Evaluated", et preparer la ligne a reporter dans le Google Sheet de suivi (16 colonnes, voir modes/_custom.md).

Contraintes non-negociables -
- Ton sobre, FR soutenu, aucune mention Claude / LLM / Groq / Llama / Sentence-Transformers comme produits commerciaux - rester generique (NLP, IA generative, agents).
- Aucune mention BDE Efrei President, Secretaire BDA, Professeur de danse Rock Efreestyle, Fondateur Douille, BIA, Aerogligli.
- Conserver uniquement Vice-President BDE ISIT (deux mandats fev 2024 a sept 2025) + cours de danse benevoles week-end.
- Email pro CV - adam.beloucif@efrei.net - Telephone - +33 7 86 46 68 34 - Residence - Chevilly-Larue (94).
- Aucune soumission automatique - generer les documents, pas cliquer Submit.

Etape 4 - Pour chaque offre prete, ecrire un TSV dans batch/tracker-additions/{num}-{company-slug}.tsv avec columns - num date company role status score pdf report notes. Status = "Evaluated". Ensuite lancer `node merge-tracker.mjs` puis `node verify-pipeline.mjs`.

Etape 5 - Apres tout le traitement, ajouter une ligne dans C:/Users/adamb/Documents/Obsidian/Claude/Apprentissages.md sous la date du jour (format ## 2026-MM-DD (suite NN - Ralph loop run)). Lister les entreprises preparees + les PDFs generes + l'action list pour Adam (liens directs vers les portails de candidature).

Sortie finale - rapport court (< 300 mots) avec -
- Nombre d'offres scannees.
- Nombre d'offres filtrees alternance M2 FR Data/IA.
- Top 10 candidatures preparees (company, role, score, PDFs generes).
- Action list Adam (3-5 items prioritaires).

Temps max alloue - 15 minutes.
"""


def log(msg: str) -> None:
    ts = dt.datetime.now().isoformat(timespec="seconds")
    line = f"[{ts}] {msg}\n"
    try:
        sys.stdout.buffer.write(line.encode("utf-8", errors="replace"))
        sys.stdout.buffer.flush()
    except Exception:
        pass
    with LOG.open("a", encoding="utf-8") as fh:
        fh.write(line)


def run(cmd: list[str], timeout: int = 600, cwd: Path = ROOT) -> int:
    log(f"> {' '.join(str(c) for c in cmd)}")
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(cwd),
            capture_output=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
        )
        if proc.stdout:
            log(f"  stdout[last 800]: {proc.stdout[-800:]}")
        if proc.returncode != 0 and proc.stderr:
            log(f"  stderr[last 400]: {proc.stderr[-400:]}")
        return proc.returncode
    except subprocess.TimeoutExpired:
        log(f"  TIMEOUT apres {timeout}s")
        return -1
    except Exception as exc:
        log(f"  exception - {exc}")
        return -2


def main() -> None:
    log("=" * 60)
    log(f"Ralph loop start - cwd={ROOT}")

    if not CLAUDE_EXE.exists():
        log(f"FATAL - claude.exe introuvable a {CLAUDE_EXE}")
        sys.exit(1)

    # 1. Scan portals
    rc = run(["node", "scan.mjs"], timeout=300)
    log(f"scan.mjs rc={rc}")

    # 2. Liveness check
    rc = run(["node", "check-liveness.mjs"], timeout=600)
    log(f"check-liveness.mjs rc={rc}")

    # 3. Claude headless pipeline (filter + eval + generate)
    rc = run(
        [
            str(CLAUDE_EXE),
            "--print",
            "--dangerously-skip-permissions",
            RALPH_PROMPT,
        ],
        timeout=900,
    )
    log(f"claude headless rc={rc}")

    # 4. Merge + verify
    rc = run(["node", "merge-tracker.mjs"], timeout=120)
    log(f"merge-tracker.mjs rc={rc}")
    rc = run(["node", "verify-pipeline.mjs"], timeout=120)
    log(f"verify-pipeline.mjs rc={rc}")

    log("Ralph loop done.")


if __name__ == "__main__":
    main()
