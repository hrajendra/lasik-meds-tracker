# LASIK Meds Tracker

Post-op medication tracker for Himateja's LASIK surgery at Smart Vision Hospital (May 15, 2026).

## Features

- **Today view** — live dose tracking with taken/skipped per dose, next-dose highlight, progress bar, and op date + week number for easy reference
- **Schedule view** — full tapering schedule for all medications
- **History view** — 14-day adherence log with per-day breakdown
- **Notifications** — browser push alerts for every scheduled dose, with "✓ Taken" / "✗ Skip" actions directly from the notification
- **Offline** — works without internet once installed (service worker cache)
- **PWA** — installable on iOS and Android home screens

## Medications tracked

| Medication | Duration | Frequency |
|---|---|---|
| Fluorometholone (FML) | 4 weeks, tapering | 4→3→2→1×/day |
| Moxifloxacin | Week 1 only | 6×/day |
| Ascon PF / PEG | 1 month | Every hour (12×/day) |
| Omega-3 (Eye-360) | 1 month | 1 tablet/day after meals |
| Dolo 650 / Ultracet | As needed | Up to 2×/day if pain |

## Install on phone

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap ⋮ → "Add to Home Screen"
3. Tap 🔔 in the app to enable dose reminders

**iPhone (Safari):**
1. Open the URL in Safari (must be Safari, not Chrome)
2. Tap Share → "Add to Home Screen"
3. Tap 🔔 to enable reminders
4. Note: iOS requires the app to be open/backgrounded for notifications to fire

## Notification behavior

- **Android**: full background notifications once installed ✅
- **iOS 16.4+**: works after "Add to Home Screen", keep app backgrounded
- Tap "✓ Taken" or "✗ Skip" directly from the notification to log without opening the app
- Notifications auto-reschedule when you open the app

## GitHub Pages deployment

Served from `main` branch root via GitHub Pages.
URL: `https://hrajendra.github.io/lasik-meds-tracker/`