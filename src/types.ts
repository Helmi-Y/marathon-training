export type WorkoutCategory = 'Easy Run' | 'Tempo Run' | 'Interval Run' | 'Long Run' | 'Upper Body' | 'Lower Body' | 'Tennis' | 'Rock Climbing' | 'Recovery' | 'Rest';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  completed: boolean;
  notes: string;
}

export type RunSegmentKind = 'warmup' | 'work' | 'recovery' | 'cooldown' | 'steady' | 'progression' | 'marathon' | 'race';

export interface RunSegment {
  kind: RunSegmentKind;
  label: string;
  distanceMiles?: number;
  durationMinutes?: number;
  durationSeconds?: number;
  distanceMeters?: number;
  estimated?: boolean;
  repetitions?: number;
  pace?: string;
  effort?: string;
}

export interface DailyWorkout {
  id: string;
  day: number;
  name: string;
  category: WorkoutCategory;
  details: string;
  duration?: string;
  distance?: number;
  pace?: string;
  rpe?: string;
  required: boolean;
  exercises?: Exercise[];
  segments?: RunSegment[];
  fueling?: string;
  notes: string;
}

export type TrainingPhase = 'Recovery and rebuilding' | 'Aerobic base' | 'Strength and endurance' | 'Marathon-specific training' | 'Taper' | 'Race week';

export interface TrainingWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  phase: TrainingPhase;
  objective: string;
  mileage: number;
  easyDistance: number;
  longDistance: number;
  recovery: string;
  paces: { easy: string; tempo: string; intervals: string; marathon: string };
  workouts: DailyWorkout[];
}

export interface WorkoutCompletion {
  completed: boolean;
  notes: string;
  completedDistance?: number;
  exercises?: Record<string, { completed: boolean; weight: string; notes: string }>;
}

export type CompletionStore = Record<string, WorkoutCompletion>;