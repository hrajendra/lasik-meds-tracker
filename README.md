# 👁 LASIK Meds Tracker

Post-op medication tracker for **Himateja** (Femto LASIK · May 15, 2026 · Both eyes).  
Built as a Progressive Web App — installable on iOS & Android, offline-capable, with dose alarms.

---

## Medications tracked

| # | Medication | Duration | Frequency |
|---|-----------|----------|-----------|
| 1 | Fluorometholone (FML) | 4 weeks, tapering | 4→3→2→1× daily |
| 2 | Moxifloxacin | Week 1 only | 6× daily |
| 3 | Ascon PF / PEG (lubricating) | 1 month | Every hour, 12×/day |
| 4 | Omega-3 (Eye-360) | 1 month | 1× daily after meals |
| 5 | Dolo 650 / Ultracet | As needed | Max 2× daily if pain |

---

## Features

- **Today view** — shows only today's active doses, auto-computed from surgery date
- **Take / Skip** per dose with undo support
- **Dose alarms** — 5-min warning + on-time notification (requires permission)
- **Snooze** — tap +5 min on any alarm
- **Schedule view** — full tapering reference table
- **History view** — day-by-day adherence log
- **Offline** — works without internet after first load
- **Installable** — add to home screen for background alarms

---

## Setup: Enable GitHub Pages

1. Go to `https://github.com/hrajendra/lasik-meds-tracker`
2. Click **Settings → Pages**
3. Under **Source**, select `Deploy from a branch`
4. Choose branch: `main`, folder: `/ (root)` → Save
5. After ~60 seconds, the app is live at:  
   **`https://hrajendra.github.io/lasik-meds-tracker/`**

---

## Install on phones

### Android (Chrome)
1. Open the URL above in Chrome
2. Tap the **⋮ menu → Add to Home Screen**
3. Grant notification permission when prompted
4. Background alarms work automatically

### iOS (Safari) — requires iOS 16.4+
1. Open the URL in **Safari** (not Chrome)
2. Tap the **Share icon → Add to Home Screen**
3. Open the installed app and grant notification permission
4. Background alarms work when installed to home screen

---

## Local development

No build step needed — plain HTML/JS/CSS.

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

---

*Only use medications selected by your doctor — Smart Vision Eye Hospitals*
