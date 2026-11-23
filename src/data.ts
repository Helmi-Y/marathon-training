import type { Exercise, TrainingWeek, WorkoutCategory } from './types';

const upperA: Exercise[] = [
  ['Bench press', '3', '5–8'], ['Row variation', '3', '8–12'], ['Lat pulldown or pull-ups', '3', '8–12'], ['Lateral raises', '3', '12–15'], ['Biceps', '2', '10–15'], ['Triceps', '2', '10–15'],
].map(([name, sets, reps], i) => ({ id: `ua-${i}`, name, sets: Number(sets), reps, weight: '', completed: false, notes: '' }));
const lowerA: Exercise[] = [
  ['Squat or leg press', '3', '5–8'], ['Romanian deadlift', '3', '6–10'], ['Reverse lunges', '3', '8 each'], ['Calf raises', '3', '12–15'], ['Core exercise', '3', '30–60 sec'],
].map(([name, sets, reps], i) => ({ id: `la-${i}`, name, sets: Number(sets), reps, weight: '', completed: false, notes: '' }));
const upperB: Exercise[] = [
  ['Incline dumbbell press', '3', '8–12'], ['Overhead press', '3', '6–10'], ['Cable row', '3', '8–12'], ['Pull-ups or lat pulldown', '3', '8–12'], ['Rear delts', '3', '12–15'], ['Biceps and triceps', '2', '10–15'],
].map(([name, sets, reps], i) => ({ id: `ub-${i}`, name, sets: Number(sets), reps, weight: '', completed: false, notes: '' }));
const lowerB: Exercise[] = [
  ['Bulgarian split squats or step-ups', '3', '8 each'], ['Hamstring curls', '3', '10–15'], ['Hip thrusts or glute bridges', '3', '10–12'], ['Tibialis raises', '3', '12–15'], ['Core exercise', '3', '30–60 sec'],
].map(([name, sets, reps], i) => ({ id: `lb-${i}`, name, sets: Number(sets), reps, weight: '', completed: false, notes: '' }));

const strengthTemplate = [
  { name: 'Upper Body A', category: 'Upper Body' as WorkoutCategory, details: 'Chest, back, shoulders, and arms', exercises: upperA },
  { name: 'Lower Body A', category: 'Lower Body' as WorkoutCategory, details: 'Heavy lower-body strength', exercises: lowerA },
  { name: 'Upper Body B', category: 'Upper Body' as WorkoutCategory, details: 'Push, pull, rear delts, and arms', exercises: upperB },
  { name: 'Lower Body B', category: 'Lower Body' as WorkoutCategory, details: 'Lighter unilateral strength and stability', exercises: lowerB },
];

function phaseFor(index: number): TrainingWeek['phase'] {
  if (index < 2) return 'Recovery and rebuilding';
  if (index < 6) return 'Aerobic base';
  if (index < 11) return 'Strength and endurance';
  if (index < 14) return 'Marathon-specific training';
  if (index === 14) return 'Taper';
  return 'Race week';
}

export const trainingPlan: TrainingWeek[] = Array.from({ length: 16 }, (_, i) => {
  const start = new Date(2026, 10, 23 + i * 7);
  const longOptions = [8, 9, 10, 8, 11, 12, 13, 11, 14, 15, 16, 14, 18, 16, 12, 2.0];
  const easyOptions = [3, 3.5, 4, 4, 4.5, 5, 5, 5, 5.5, 6, 6, 5.5, 6.5, 5.5, 4, 3];
  const qualityOptions = [4, 4, 5, 4.5, 5.5, 6, 6, 5, 7, 7, 8, 6, 8, 6, 5, 3];
  const easy = easyOptions[i];
  const long = longOptions[i];
  const quality = qualityOptions[i];
  const mileage = Number((easy + long + quality).toFixed(1));
  const phase = phaseFor(i);
  const weekWorkouts = [
    { id: `w${i}-mon`, day: 0, name: strengthTemplate[0].name, category: strengthTemplate[0].category, details: strengthTemplate[0].details, duration: '45–60 min', required: true, exercises: strengthTemplate[0].exercises, notes: 'Keep 2–3 reps in reserve.' },
    { id: `w${i}-tue`, day: 1, name: i % 3 === 0 ? 'Interval Run' : 'Tempo Run', category: i % 3 === 0 ? 'Interval Run' as const : 'Tempo Run' as const, details: i % 3 === 0 ? 'Warm-up, controlled intervals, and easy recovery jog' : 'Warm-up, 20–40 min tempo, and cool-down', distance: quality, duration: '50–70 min', pace: i >= 14 ? 'Easy effort' : i >= 11 ? '8:45–9:20 /mi' : '9:00–9:45 /mi', required: true, notes: 'Separate from lifting by several hours when possible.' },
    { id: `w${i}-wed`, day: 2, name: 'Lower Body A', category: 'Lower Body' as const, details: 'Heavier lower-body strength', duration: '50–65 min', required: true, exercises: strengthTemplate[1].exercises, notes: 'Prioritize controlled quality and avoid failure.' },
    { id: `w${i}-thu`, day: 3, name: 'Easy Aerobic Run', category: 'Easy Run' as const, details: 'Conversational easy miles', distance: easy, duration: '40–60 min', pace: '10:15–11:15 /mi', required: true, notes: 'Keep the effort genuinely easy.' },
    { id: `w${i}-fri`, day: 4, name: 'Upper Body B', category: 'Upper Body' as const, details: strengthTemplate[2].details, duration: '45–55 min', required: true, exercises: strengthTemplate[2].exercises, notes: 'Maintain strength with controlled volume.' },
    { id: `w${i}-sat`, day: 5, name: i % 2 === 0 ? 'Tennis' : 'Lower Body B', category: i % 2 === 0 ? 'Tennis' as const : 'Lower Body' as const, details: i % 2 === 0 ? 'Optional social or practice session' : strengthTemplate[3].details, duration: i % 2 === 0 ? '60–90 min' : '40–50 min', required: i % 2 !== 0, exercises: i % 2 !== 0 ? strengthTemplate[3].exercises : undefined, notes: i % 2 === 0 ? 'Optional; replace with rest if fatigued.' : 'Lighter lower-body and stability work.' },
    { id: `w${i}-sun`, day: 6, name: 'Long Run', category: 'Long Run' as const, details: i >= 14 ? 'Short, easy run with race-pace segments only if it feels good' : 'Steady aerobic long run', distance: long, duration: i >= 14 ? '20–75 min' : '75–180 min', pace: i >= 14 ? 'Easy; strides optional' : '10:00–10:45 /mi', required: true, notes: 'Fuel consistently and keep most of the run comfortable.' },
  ].filter((workout) => !(i >= 14 && workout.name === 'Tennis')); 

  return {
    id: `week-${i + 1}`,
    weekNumber: i + 1,
    startDate: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`,
    phase,
    objective: i === 15 ? 'Stay calm, fresh, and ready for race day.' : i >= 14 ? 'Reduce volume and preserve race-day fitness.' : i >= 11 ? 'Practice marathon effort while maintaining strength.' : i >= 6 ? 'Build durable aerobic fitness and controlled strength.' : 'Rebuild consistency and absorb training gently.',
    mileage,
    easyDistance: easy,
    longDistance: long,
    recovery: i >= 14 ? 'Sleep, hydration, and 2–3 easy short runs; minimize fatigue.' : 'Prioritize sleep and leave at least one full rest/easy day between hard sessions.',
    paces: i >= 14 ? { easy: '10:15–11:15', tempo: '9:05–9:25', intervals: '8:15–8:45', marathon: '9:09' } : { easy: '10:15–11:15', tempo: '9:05–9:25', intervals: '8:30–9:00', marathon: '9:09' },
    workouts: weekWorkouts,
  };
});
