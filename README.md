# Marathon + Strength Planner

A responsive React and TypeScript training dashboard for the March 7, 2027 marathon goal of sub-4:00.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## Plan structure

- `src/types.ts` defines workouts, exercises, weekly phases, pace targets, and completion records.
- `src/data.ts` generates the draft 16-week training plan. The mileage and dates are editable draft values, not a clinically or coach-validated prescription.
- `src/utils.ts` contains date, mileage, completion, race countdown, and formatting calculations.
- `src/App.tsx` contains the dashboard, navigation, editing modal, and chart.

## Modifying the plan

Edit `trainingPlan` in `src/data.ts` to change weekly mileage, easy/long-run distances, phases, paces, recovery notes, and workouts. The UI edit modal can add, move, rename, or remove an individual workout for the selected week.

Workout completion and notes are stored separately under `marathon-completions-v1` in localStorage. The editable plan is stored under `marathon-plan-v1`. Editing or replacing plan content does not clear completion history.

## Persistence

The browser stores plan configuration and completion state locally. No server or account is required.
