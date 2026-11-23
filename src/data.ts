import type { Exercise, RunSegment, TrainingWeek } from './types';

const upperATemplate: Exercise[] = [
  { id: 'template', name: 'Bench press', sets: 3, reps: '6–8', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Row variation', sets: 3, reps: '8–12', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Lat pulldown or pull-ups', sets: 3, reps: '8–12', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Lateral raises', sets: 3, reps: '12–15', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Biceps', sets: 2, reps: '10–15', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Triceps', sets: 2, reps: '10–15', weight: '', completed: false, notes: '' },
];

const lowerATemplate: Exercise[] = [
  { id: 'template', name: 'Squat or leg press', sets: 3, reps: '6–8', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Romanian deadlift', sets: 3, reps: '6–10', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Reverse lunges', sets: 3, reps: '8 each', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Calf raises', sets: 2, reps: '12–15', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Core exercise', sets: 3, reps: '30–60 sec', weight: '', completed: false, notes: '' },
];

const upperBTemplate: Exercise[] = [
  { id: 'template', name: 'Incline dumbbell press', sets: 3, reps: '8–12', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Overhead press', sets: 3, reps: '6–10', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Cable row', sets: 3, reps: '8–12', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Pull-ups or lat pulldown', sets: 3, reps: '8–12', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Rear delts', sets: 3, reps: '12–15', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Biceps and triceps', sets: 2, reps: '10–15', weight: '', completed: false, notes: '' },
];

const lowerBTemplate: Exercise[] = [
  { id: 'template', name: 'Bulgarian split squats or step-ups', sets: 2, reps: '8 each', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Hamstring curls', sets: 2, reps: '10–15', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Hip thrusts or glute bridges', sets: 2, reps: '10–12', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Tibialis raises', sets: 2, reps: '12–15', weight: '', completed: false, notes: '' },
  { id: 'template', name: 'Core exercise', sets: 2, reps: '30–60 sec', weight: '', completed: false, notes: '' },
];

function cloneExercises(template: Exercise[], workoutId: string): Exercise[] {
  return template.map((exercise, index) => ({
    ...exercise,
    id: `${workoutId}-exercise-${index}`,
    completed: false,
    weight: '',
    notes: '',
  }));
}

function runSegments(name: string, distance: number, segments: RunSegment[], pace: string, rpe: string, notes: string, fueling?: string) {
  return { name, distance, pace, rpe, segments, fueling, notes, details: name };
}

function phaseFor(index: number): TrainingWeek['phase'] {
  if (index < 3) return 'Recovery and rebuilding';
  if (index < 6) return 'Aerobic base';
  if (index < 11) return 'Strength and endurance';
  if (index < 13) return 'Marathon-specific training';
  if (index === 13) return 'Taper';
  return 'Race week';
}

export const trainingPlan: TrainingWeek[] = Array.from({ length: 15 }, (_, i) => {
  const start = new Date(2026, 10, 23 + i * 7);
  const easy = [3.5, 4, 4, 4.5, 5, 5, 5.5, 5.5, 6, 6, 6.5, 5.5, 5, 3.5, 3][i];
  const long = [8, 9, 10, 9, 11, 12, 13, 12, 14, 15, 16, 14, 18, 10, 26.2][i];
  const phase = phaseFor(i);

  const qualityPrescriptions = [
    runSegments('Easy controlled tempo', 4.5, [{kind:'warmup',label:'Warm-up',distanceMiles:1,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'Tempo block',distanceMiles:2.5,pace:'9:45–10:05/mi',effort:'RPE 6'},{kind:'cooldown',label:'Cooldown',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:45–10:05/mi', 'RPE 6', 'A re-entry workout; stop the tempo section early if post-race fatigue is present.'),
    runSegments('Short intervals', 5, [{kind:'warmup',label:'Warm-up',distanceMiles:1,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'5 × 800 m intervals',distanceMeters:800,repetitions:5,pace:'9:05–9:20/mi',effort:'RPE 7'},{kind:'recovery',label:'Easy jog between repeats',durationMinutes:2,estimated:true,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'cooldown',label:'Cooldown',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:05–9:20/mi', 'RPE 7', 'Recovery jog totals approximately 0.5 mile if run at 10:45–11:30 pace.'),
    runSegments('Aerobic progression', 5.5, [{kind:'warmup',label:'Easy opening',distanceMiles:2,pace:'10:45–11:30/mi',effort:'RPE 3'},{kind:'progression',label:'Steady progression',distanceMiles:2.5,pace:'10:10–10:30/mi',effort:'RPE 5–6'},{kind:'cooldown',label:'Easy finish',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], 'Easy to steady', 'RPE 3–6', 'Keep the final mile controlled rather than fast.'),
    runSegments('Threshold', 5.5, [{kind:'warmup',label:'Warm-up',distanceMiles:1,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'Continuous threshold',distanceMiles:3.5,pace:'9:20–9:35/mi',effort:'RPE 7'},{kind:'cooldown',label:'Cooldown',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:20–9:35/mi', 'RPE 7', 'Comfortably hard: you should not need to sprint.'),
    runSegments('Marathon-pace intervals', 6, [{kind:'warmup',label:'Warm-up',distanceMiles:1,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'3 × 1 mile marathon pace',distanceMiles:1,repetitions:3,pace:'9:05–9:15/mi',effort:'RPE 6–7'},{kind:'recovery',label:'Easy jog between repeats',durationMinutes:3,estimated:true,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'cooldown',label:'Cooldown',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:05–9:15/mi', 'RPE 6–7', 'This introduces goal pace briefly, not an all-out race effort.'),
    runSegments('Long intervals', 6.5, [{kind:'warmup',label:'Warm-up',distanceMiles:1,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'3 × 1.5 miles',distanceMiles:1.5,repetitions:3,pace:'8:55–9:10/mi',effort:'RPE 7–8'},{kind:'recovery',label:'Easy jog between repeats',durationMinutes:4,estimated:true,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'cooldown',label:'Cooldown',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '8:55–9:10/mi', 'RPE 7–8', 'Approximately 0.4 mile of recovery jog per 4-minute repeat, depending on pace.'),
    runSegments('Threshold intervals', 7, [{kind:'warmup',label:'Warm-up',distanceMiles:1,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'3 × 1.5-mile threshold intervals',distanceMiles:1.5,repetitions:3,pace:'9:15–9:25/mi',effort:'RPE 7'},{kind:'recovery',label:'Easy jog between repeats',durationMinutes:3,estimated:true,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'cooldown',label:'Cooldown',distanceMiles:1,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:15–9:25/mi', 'RPE 7', 'Judgment over pace: shorten or stop if form deteriorates.'),
    runSegments('Continuous tempo', 7.5, [{kind:'warmup',label:'Warm-up',distanceMiles:1.5,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'Continuous controlled tempo',distanceMiles:4.5,pace:'9:15–9:25/mi',effort:'RPE 6–7'},{kind:'cooldown',label:'Cooldown',distanceMiles:1.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:15–9:25/mi', 'RPE 6–7', 'No faster surges; maintain an even, sustainable effort.'),
    runSegments('Marathon-pace blocks', 8, [{kind:'warmup',label:'Warm-up',distanceMiles:1.5,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'2 × 2 miles at marathon pace',distanceMiles:2,repetitions:2,pace:'9:05–9:15/mi',effort:'RPE 6–7'},{kind:'recovery',label:'Easy jog between blocks',distanceMiles:.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'cooldown',label:'Cooldown',distanceMiles:1.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:05–9:15/mi', 'RPE 6–7', 'Practice fueling before and around the marathon-pace work.'),
    runSegments('Long intervals', 8.5, [{kind:'warmup',label:'Warm-up',distanceMiles:1.5,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'work',label:'2 × 3 miles',distanceMiles:3,repetitions:2,pace:'9:05–9:15/mi',effort:'RPE 7'},{kind:'recovery',label:'Easy jog between repeats',distanceMiles:.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'cooldown',label:'Cooldown',distanceMiles:1.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:05–9:15/mi', 'RPE 7', 'This session is demanding; skip it if legs remain heavy from Lower A.'),
    runSegments('Marathon-pace controlled run', 9, [{kind:'warmup',label:'Warm-up',distanceMiles:2,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'marathon',label:'Marathon-pace middle',distanceMiles:5,pace:'9:05–9:15/mi',effort:'RPE 6–7'},{kind:'cooldown',label:'Cooldown',distanceMiles:2,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:05–9:15/mi', 'RPE 6–7', 'Practice race effort and fueling; do not turn this into a time trial.'),
    runSegments('Progression tempo', 8, [{kind:'warmup',label:'Warm-up',distanceMiles:2,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'progression',label:'First controlled block',distanceMiles:2,pace:'9:30–9:40/mi',effort:'RPE 6'},{kind:'progression',label:'Second controlled block',distanceMiles:2,pace:'9:15–9:25/mi',effort:'RPE 6–7'},{kind:'cooldown',label:'Cooldown',distanceMiles:2,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:15–9:40/mi', 'RPE 6–7', 'Reduce volume rather than pace if fatigue is present.'),
    runSegments('Final marathon specificity', 7.5, [{kind:'warmup',label:'Warm-up',distanceMiles:1.5,pace:'10:30–11:15/mi',effort:'RPE 2–3'},{kind:'marathon',label:'Marathon-pace block',distanceMiles:4.5,pace:'9:05–9:15/mi',effort:'RPE 6–7'},{kind:'cooldown',label:'Cooldown',distanceMiles:1.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '9:05–9:15/mi', 'RPE 6–7', 'A sharpened session, not a maximum effort.'),
    runSegments('Easy strides', 5, [{kind:'warmup',label:'Warm-up',distanceMiles:2,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'work',label:'4 × 20-second relaxed strides',durationSeconds:20,repetitions:4,pace:'Faster than easy, fully controlled',effort:'RPE 5'},{kind:'cooldown',label:'Cooldown',distanceMiles:2,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], 'Easy effort', 'RPE 2–5', 'Optional if the legs feel tired; omit strides when needed.'),
    runSegments('Light pre-race shakeout', 3, [{kind:'warmup',label:'Easy opening',distanceMiles:1.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'},{kind:'work',label:'Optional short strides',durationMinutes:2,repetitions:4,pace:'Relaxed and crisp',effort:'RPE 4–5'},{kind:'cooldown',label:'Easy finish',distanceMiles:1.5,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], 'Easy effort', 'RPE 2–5', 'Best done 2–3 days before race; not after Friday.'),
  ];

  const qualityName = qualityPrescriptions[i];
  const easyRun = i === 14
    ? runSegments('Race week easy shakeout', easy, [{kind:'warmup',label:'Easy aerobic run',distanceMiles:easy,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '10:45–11:30/mi', 'RPE 2–3', 'Optional light mobility; stop rather than force volume.')
    : runSegments(i % 4 === 3 ? 'Recovery aerobic run' : 'Easy aerobic run', easy, [{kind:'warmup',label:'Entire easy run',distanceMiles:easy,pace:'10:30–11:30/mi',effort:'RPE 2–4'}], '10:30–11:30/mi', 'RPE 2–4', 'Conversational effort. Terrain and heat may require slowing further.');

  const longPrescription = i === 14
    ? runSegments('Marathon — Sunday, March 7', 26.2, [{kind:'race',label:'Full marathon',distanceMiles:26.2,pace:'Target ~9:09/mi',effort:'RPE 7–8'}], 'Approx. 9:09/mi', 'RPE 7–8', 'Race day. Start conservatively, fuel regularly, and adjust for weather.', 'Begin carbohydrates before race; take 40–60 g/hour as practiced, starting around 30–45 minutes.')
    : i === 13
      ? runSegments('Reduced easy long run', 10, [{kind:'warmup',label:'Easy aerobic miles',distanceMiles:10,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], '10:45–11:30/mi', 'RPE 2–3', 'Purpose is to remain loose, not to bank fitness.')
      : i === 12
        ? runSegments('Aerobic long run', 18, [{kind:'warmup',label:'Easy opening',distanceMiles:8,pace:'10:45–11:30/mi',effort:'RPE 3'},{kind:'steady',label:'Controlled middle',distanceMiles:6,pace:'10:10–10:35/mi',effort:'RPE 5–6'},{kind:'progression',label:'Gentle finish',distanceMiles:4,pace:'9:30–9:50/mi',effort:'RPE 6'}], 'Mixed: 10:45–9:30/mi', 'RPE 3–6', 'Keep this controlled; this is a peak endurance stimulus, not a race simulation.','Start 30–45 minutes, then 40–60 g carbohydrates/hour.')
        : i === 10
          ? runSegments('Aerobic + steady long run', 16, [{kind:'warmup',label:'Easy opening',distanceMiles:8,pace:'10:45–11:30/mi',effort:'RPE 3'},{kind:'steady',label:'Steady middle',distanceMiles:5,pace:'10:00–10:20/mi',effort:'RPE 5'},{kind:'progression',label:'Controlled finish',distanceMiles:3,pace:'9:25–9:45/mi',effort:'RPE 6'}], 'Mixed: 10:45–9:25/mi', 'RPE 3–6', 'Fuel consistently and stop progressing if soreness or fatigue accumulates.','Start 30–45 minutes, then 40–60 g carbohydrates/hour.')
          : i === 9
            ? runSegments('Marathon-pace block long run', 15, [{kind:'warmup',label:'Easy opening',distanceMiles:8,pace:'10:45–11:30/mi',effort:'RPE 3'},{kind:'marathon',label:'Marathon-pace block',distanceMiles:4,pace:'9:05–9:15/mi',effort:'RPE 6–7'},{kind:'cooldown',label:'Easy finish',distanceMiles:3,pace:'10:45–11:30/mi',effort:'RPE 3'}], 'Mixed: 10:45–9:05/mi', 'RPE 3–7', 'Only add the marathon-pace block if the opening miles feel genuinely easy.','Practice 40–60 g/hour, beginning around 30–45 minutes.')
            : i === 7
              ? runSegments('Cutback easy long run', 12, [{kind:'warmup',label:'Entire cutback long run',distanceMiles:12,pace:'10:45–11:30/mi',effort:'RPE 2–4'}], '10:45–11:30/mi', 'RPE 2–4', 'Absorb the previous quality and strength work; keep it genuinely easy.','For over 90 minutes, use 30–45 g carbohydrates/hour.')
              : i === 4
                ? runSegments('Progression long run', 11, [{kind:'warmup',label:'Easy opening',distanceMiles:6,pace:'10:45–11:30/mi',effort:'RPE 3'},{kind:'steady',label:'Steady middle',distanceMiles:3,pace:'10:10–10:30/mi',effort:'RPE 5'},{kind:'progression',label:'Controlled finish',distanceMiles:2,pace:'9:25–9:45/mi',effort:'RPE 6'}], 'Mixed: 10:45–9:25/mi', 'RPE 3–6', 'Use this as a quality-adjacent long run, not a race effort.','Practice fuel from 30–45 minutes; 30–45 g/hour.')
                : runSegments(i === 2 ? 'Easy aerobic long run' : 'Steady easy long run', long, [{kind:'warmup',label:'Entire run, mostly easy',distanceMiles:long,pace:'10:45–11:30/mi',effort:'RPE 2–4'}], '10:45–11:30/mi', 'RPE 2–4', i === 2 ? 'Return to longer running conservatively after the post-race recovery phase.' : 'Keep effort conversational and prioritize consistency.', i >= 8 ? 'For runs over 90 minutes, start at 30–45 minutes and take 30–60 g carbohydrates/hour.' : 'Fuel only as needed for runs over 75 minutes; practice what you plan to use in racing.');

  const workoutId = (day: string) => `w${i}-${day}`;
  const upperAId = workoutId('mon');
  const lowerAId = workoutId('tue-lower');
  const upperBId = workoutId('thu-upper');
  const lowerBId = workoutId('fri');

  const upperA = i >= 13 ? cloneExercises(upperATemplate.map(ex => ({...ex, sets:2})), upperAId) : cloneExercises(upperATemplate, upperAId);
  const lowerA = i >= 11 ? cloneExercises(lowerATemplate.map(ex => ({...ex, sets: 2})), lowerAId) : cloneExercises(lowerATemplate, lowerAId);
  const upperB = i >= 13 ? cloneExercises(upperBTemplate.map(ex => ({...ex, sets: 2})), upperBId) : cloneExercises(upperBTemplate, upperBId);
  const lowerB = cloneExercises(lowerBTemplate.map(ex => i >= 11 ? ({...ex, sets:2}) : ex), lowerBId);

  const mon: TrainingWeek['workouts'][number] = i === 14
    ? { id: upperAId, day:0, name:'Rest or mobility', category:'Recovery', details:'Optional easy mobility and foot maintenance', duration:'10–20 min', required:false, notes:'No mandatory strength on race day week.' }
    : { id:upperAId, day:0, name:'Upper Body A', category:'Upper Body', details:'Chest, back, shoulders, arms, and foot maintenance', duration:i>=11?'40–50 min':'45–60 min', required:true, exercises:upperA, notes:'2–3 working sets; leave 2–3 reps in reserve.' };

  const tue: TrainingWeek['workouts'][number] = i === 14
    ? { id:workoutId('tue-quality'), day:1, name:'No mandatory quality run', category:'Easy Run', details:'Optional 20-minute easy jog with relaxed strides', distance:2, duration:'20–30 min', pace:'10:45–11:30/mi', rpe:'RPE 2–4', required:false, segments:[{kind:'warmup',label:'Optional easy run',distanceMiles:2,pace:'10:45–11:30/mi',effort:'RPE 2–3'}], notes:'Skip entirely if the legs feel flat.' }
    : { id:workoutId('tue-quality'), day:1, name:qualityName.name, category:qualityName.name.includes('interval')?'Interval Run':'Tempo Run', details:qualityName.details, distance:qualityName.distance, duration:'45–75 min', pace:qualityName.pace, rpe:qualityName.rpe, required:true, segments:qualityName.segments, fueling:'Practice race fueling if the session exceeds 75 minutes.', notes:qualityName.notes };

  const lowerAWorkout: TrainingWeek['workouts'][number] = i === 14
    ? { id:lowerAId, day:1, name:'Lower A — optional reset', category:'Recovery', details:'Very light, optional activation or complete rest', duration:'15–20 min', required:false, notes:'No heavy lower-body loading in race week.' }
    : { id:lowerAId, day:1, name:'Lower Body A', category:'Lower Body', details:'Heavy lower-body strength; separated from quality running', duration:i>=11?'35–45 min':'45–60 min', required:true, exercises:lowerA, notes:'Prioritize quality. Leave 2–3 reps in reserve and reduce load if sore.' };

  const satOptional: TrainingWeek['workouts'][number] = i === 14
    ? { id:workoutId('sat'), day:5, name:'Rest', category:'Rest', details:'Prioritize rest and prepare for race day', required:false, notes:'No tennis or climbing.' }
    : { id:workoutId('sat'), day:5, name:i%2===0?'Optional tennis':'Optional rock climbing', category:i%2===0?'Tennis':'Rock Climbing', details:'Light, social activity only; replace with rest if fatigued', duration:'60–90 min', required:false, notes:'Optional and not included in the required-workout percentage.' };

  const sunday: TrainingWeek['workouts'][number] = i === 14
    ? { id:workoutId('sun'), day:6, name:'Race — Marathon', category:'Long Run', details:'Sunday, March 7: 26.2-mile marathon', distance:26.2, duration:'Race day', pace:'Approximately 9:09/mi', rpe:'RPE 7–8', required:true, segments:longPrescription.segments, fueling:longPrescription.fueling, notes:longPrescription.notes }
    : { id:workoutId('sun'), day:6, name:longPrescription.name, category:'Long Run', details:longPrescription.details, distance:long, duration:i>=11?'2–3 hr':'75–180 min', pace:longPrescription.pace, rpe:longPrescription.rpe, required:true, segments:longPrescription.segments, fueling:longPrescription.fueling, notes:longPrescription.notes };

  const workouts: TrainingWeek['workouts'] = [
    mon,
    tue,
    lowerAWorkout,
    { id:workoutId('wed'), day:2, name:'Recovery and mobility', category:'Recovery', details:'Easy mobility, Achilles/calf care, or technical easy climbing', duration:'20–40 min', required:false, notes:'Keep Wednesday free of mandatory heavy lower-body work.' },
    { id:workoutId('thu-easy'), day:3, name:easyRun.name, category:'Easy Run', details:easyRun.details, distance:easy, duration:'35–60 min', pace:easyRun.pace, rpe:easyRun.rpe, required:true, segments:easyRun.segments, fueling:easyRun.fueling, notes:easyRun.notes },
    i === 14 ? { id:upperBId, day:3, name:'Upper B — rest or very light', category:'Recovery', details:'Optional light activation; otherwise complete rest', duration:'15–20 min', required:false, notes:'Avoid fatiguing upper-body work before race day.' } : { id:upperBId, day:3, name:'Upper Body B', category:'Upper Body', details:'Incline press, overhead work, cable row, pull, rear delts, and arms', duration:i>=11?'35–45 min':'45–55 min', required:true, exercises:upperB, notes:'Controlled 2–3 sets; reduce volume as running mileage rises.' },
    i === 14 ? { id:lowerBId, day:4, name:'Rest', category:'Rest', details:'Complete rest and race preparation', required:false, notes:'No mandatory lower-body strength.' } : { id:lowerBId, day:4, name:'Lower Body B', category:'Lower Body', details:'Lighter single-leg, posterior-chain, and stability emphasis', duration:'35–45 min', required:true, exercises:lowerB, notes:'Keep Friday light to protect Sunday. Include tibialis and calf maintenance without excessive volume.' },
    satOptional,
    sunday,
  ];

  const mileage = Number(workouts
    .filter((workout) => ['Easy Run', 'Tempo Run', 'Interval Run', 'Long Run'].includes(workout.category))
    .reduce((sum, workout) => sum + (workout.distance ?? 0), 0)
    .toFixed(1));

  return {
    id:`week-${i+1}`,
    weekNumber:i+1,
    startDate:`${start.getFullYear()}-${String(start.getMonth()+1).padStart(2,'0')}-${String(start.getDate()).padStart(2,'0')}`,
    phase,
    objective:i===14?'Stay fresh, confident, and ready for the marathon.' : i>=13?'Taper volume while preserving rhythm.' : i>=11?'Build marathon endurance and specific goal-pace confidence.' : i>=6?'Develop durable aerobic capacity and controlled strength.' : i<3?'Rebuild gradually after the half-marathon race and absorb training.' : 'Establish consistent easy mileage and strengthen the full-body base.',
    mileage,
    easyDistance:easy,
    longDistance:long,
    recovery:i>=13?'Prioritize sleep, food, and hydration. No makeup training when tired.' : i>=11?'One or two full easy days and controlled Friday lifting are important before Sunday.' : 'Keep easy days genuinely easy and leave 2–3 reps in reserve in lifting.',
    paces:i>=13?{easy:'10:45–11:30',tempo:'9:15–9:25',intervals:'Effort based',marathon:'9:09'}:{easy:'10:30–11:30',tempo:'9:15–9:35',intervals:'8:55–9:20',marathon:'9:05–9:15'},
    workouts,
  };
});
