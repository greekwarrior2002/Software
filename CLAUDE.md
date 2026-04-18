# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: SleepTracker

A personal sleep tracking app with factor correlation analysis. Platforms: iOS, macOS (SwiftUI), and web browser (React PWA). All data syncs via **iCloud/CloudKit** — no separate backend.

## Repository Structure

```
SleepTracker/          SwiftUI app — iOS 17+ and macOS 14+ from one codebase
sleep-tracker-web/     React + TypeScript PWA using CloudKit JS
```

## Build & Run

### Native App (SwiftUI)
```bash
# Primary development: open in Xcode
open SleepTracker/SleepTracker.xcodeproj

# Generate .xcodeproj from project.yml (requires: brew install xcodegen)
cd SleepTracker && xcodegen generate

# Build for iOS Simulator
xcodebuild -project SleepTracker/SleepTracker.xcodeproj \
  -scheme SleepTracker \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro' build

# Run tests
xcodebuild test -project SleepTracker/SleepTracker.xcodeproj \
  -scheme SleepTracker \
  -destination 'platform=iOS Simulator,name=iPhone 16 Pro'
```

### Web App
```bash
cd sleep-tracker-web
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview production build
npm run typecheck    # tsc --noEmit
npm test             # vitest
```

## Architecture

### Sync Model
SwiftData + CloudKit powers automatic sync across iOS and macOS. The web app uses **CloudKit JS** (`tsl-apple-cloudkit`) to access the same iCloud container — same data, no extra backend. Users sign in with Apple ID on the web.

CloudKit container ID is set in three places — keep them in sync:
- `SleepTracker/SleepTracker.entitlements` (`com.apple.developer.icloud-container-identifiers`)
- `SleepTracker/project.yml` (entitlements reference)
- `sleep-tracker-web/src/cloudkit/client.ts` (`containerIdentifier`)

### Native App (SleepTracker/)

**Entry point**: `SleepTrackerApp.swift` — sets up `modelContainer` with `cloudKitDatabase: .automatic`.

**Models** (`Models/`): `SleepSession` and `LifestyleEntry` are SwiftData `@Model` classes. Field names must exactly match the CloudKit record type field names defined in CloudKit Dashboard.

**Services** (`Services/HealthKitService.swift`): Fetches sleep data from Apple Health, consolidates overlapping Apple Watch sleep stages (gap < 5 min = same session), and optionally writes manual entries back. HealthKit is native-only; web records carry `source: "web"`. Use `HealthKitServiceProtocol` + a mock for Simulator/unit tests.

**ViewModels**: `@Observable` classes (iOS 17 Observation framework). Injected via `.environment()`. `AnalyticsViewModel` computes Pearson correlation entirely in memory — data volumes are small.

**Views** (`Views/`): `ContentView` is a `TabView` (Sleep / Lifestyle / Analytics / Settings). macOS renders as `NavigationSplitView`. Platform-specific APIs (file pickers, etc.) are wrapped in `#if os(macOS)` / `#if os(iOS)`. Charts use Swift Charts (`import Charts`).

### Web App (sleep-tracker-web/)

**CloudKit layer** (`src/cloudkit/`): `client.ts` initialises the CloudKit JS container once; `records.ts` exposes typed async functions (`fetchSleepSessions`, `saveSleepSession`, etc.) over `privateDatabase`. All CloudKit access flows through these two files.

**Hooks** (`src/hooks/`): React hooks wrapping CloudKit record fetches. `useCorrelations.ts` is pure computation over already-loaded arrays — no direct CloudKit access.

**Stats** (`src/utils/stats.ts`): Pearson correlation implementation. Pure function, unit-tested in isolation with Vitest. Correlation display is suppressed when n < 7.

**PWA**: `vite-plugin-pwa` generates the service worker. The app shell loads offline after the first visit; all data is fetched live from CloudKit (no local cache for data — only the app shell is cached).

## Data Model

Two CloudKit record types (define in CloudKit Dashboard before first run):

**SleepSession**: `startTime` (DateTime), `endTime` (DateTime), `durationMinutes` (Int64), `quality` (Int64, optional 1–5), `source` (String: `healthkit`/`manual`/`web`), `notes` (String, optional)

**LifestyleEntry**: `date` (String, `YYYY-MM-DD`), `category` (String enum: `caffeine`, `alcohol`, `exercise`, `stress`, `screen_time`, `nap`, `medication`, `other`), `value` (Double), `unit` (String), `notes` (String, optional)

## Prerequisites

- Apple Developer account (required for CloudKit + HealthKit entitlements)
- CloudKit Dashboard: create the two record types above; generate a web API token for `sleep-tracker-web/src/cloudkit/client.ts`
- XcodeGen (`brew install xcodegen`) to regenerate `.xcodeproj` after editing `project.yml`
