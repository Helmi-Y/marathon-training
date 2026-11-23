import type { CompletionStore, TrainingWeek } from './types';

export const RACE_DATE = '2027-03-07';

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? parseLocalDate(value) : value;
  return new Intl.DateTimeFormat('en-US', options ?? { month: 'short', day: 'numeric' }).format(date);
}

export function formatPace(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export function getDaysUntilRace(today = new Date()): number {
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const race = parseLocalDate(RACE_DATE);
  return Math.max(0, Math.ceil((race.getTime() - current.getTime()) / 86400000));
}

export function getCurrentWeek(weeks: TrainingWeek[], today: Date = new Date()): TrainingWeek | undefined {
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return weeks.find((week) => {
    const start = parseLocalDate(week.startDate).getTime();
    const end = addDays(parseLocalDate(week.startDate), 6).getTime();
    return current >= start && current <= end;
  }) ?? weeks[0];
}

export function weeklyCompletion(week: TrainingWeek, completions: CompletionStore): number {
  const required = week.workouts.filter((workout) => workout.required);
  if (!required.length) return 0;
  const completed = required.filter((workout) => completions[workout.id]?.completed).length;
  return Math.round((completed / required.length) * 100);
}

export function plannedMileage(week: TrainingWeek): number {
  return week.workouts.filter((workout) => workout.category.includes('Run')).reduce((sum, workout) => sum + (workout.distance ?? 0), 0);
}

export function completedMileage(week: TrainingWeek, completions: CompletionStore): number {
  return week.workouts.reduce((sum, workout) => {
    if (!workout.category.includes('Run') || !completions[workout.id]?.completed) return sum;
    return sum + (completions[workout.id]?.completedDistance ?? workout.distance ?? 0);
  }, 0);
}

export function strengthCompleted(week: TrainingWeek, completions: CompletionStore): number {
  return week.workouts.filter((workout) => (workout.category === 'Upper Body' || workout.category === 'Lower Body') && completions[workout.id]?.completed).length;
}
