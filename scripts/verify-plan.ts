import { trainingPlan } from '../src/data.ts';

function assert(value: unknown, message: string): void {
  if (!value) throw new Error(message);
}

assert(trainingPlan.length === 15, 'Expected 15 weeks');
assert(trainingPlan[0].startDate === '2026-11-23', 'Wrong first date');
assert(trainingPlan[14].startDate === '2027-03-01', 'Wrong race-week date');

const race = trainingPlan[14].workouts.find((workout) => workout.category === 'Long Run');
assert(race?.distance === 26.2, 'Wrong race distance');

trainingPlan.forEach((week, index) => {
  const runs = week.workouts.filter((workout) => ['Easy Run', 'Tempo Run', 'Interval Run', 'Long Run'].includes(workout.category));
  const strength = week.workouts.filter((workout) => workout.category === 'Upper Body' || workout.category === 'Lower Body');

  assert(week.workouts.some((workout) => workout.day === 2 && workout.category === 'Recovery'), `Wednesday recovery missing in week ${index + 1}`);
  assert(week.workouts.filter((workout) => workout.category === 'Tennis' || workout.category === 'Rock Climbing').every((workout) => !workout.required), `Optional activity is required in week ${index + 1}`);

  if (index < 14) {
    assert(runs.filter((workout) => workout.required).length === 3, `Required run count is not 3 in week ${index + 1}`);
    assert(strength.filter((workout) => workout.required).length === 4, `Strength count is not 4 in week ${index + 1}`);
  }

  const runMiles = runs.reduce((sum, workout) => sum + (workout.distance ?? 0), 0);
  assert(Math.abs(runMiles - week.mileage) < 0.11, `Mileage mismatch in week ${index + 1}: ${runMiles} vs ${week.mileage}`);
});

const exerciseIds = trainingPlan.flatMap((week) => week.workouts.flatMap((workout) => workout.exercises?.map((exercise) => exercise.id) ?? []));
assert(new Set(exerciseIds).size === exerciseIds.length, 'Exercise IDs are duplicated across workout instances');

console.log(`Plan integrity OK: ${trainingPlan.length} weeks; race week ${trainingPlan[14].startDate}; ${exerciseIds.length} independent exercise instances`);
