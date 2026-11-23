import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Dumbbell, Gauge, Plus, Route, Trophy, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { trainingPlan as initialPlan } from './data';
import type { CompletionStore, DailyWorkout, RunSegment, TrainingWeek, WorkoutCategory } from './types';
import { completedMileage, formatDate, getDaysUntilRace, parseLocalDate, plannedMileage, strengthCompleted, weeklyCompletion } from './utils';
import './App.css';

const PLAN_KEY = 'marathon-plan-v3';
const COMPLETION_KEY = 'marathon-completions-v3';
const categories: WorkoutCategory[] = ['Easy Run','Tempo Run','Interval Run','Long Run','Upper Body','Lower Body','Tennis','Rock Climbing','Recovery','Rest'];

function App() {
  const [plan, setPlan] = useState<TrainingWeek[]>(() => {
    const saved = localStorage.getItem(PLAN_KEY);
    return saved ? JSON.parse(saved) as TrainingWeek[] : initialPlan;
  });
  const [completions, setCompletions] = useState<CompletionStore>(() => {
    const saved = localStorage.getItem(COMPLETION_KEY);
    return saved ? JSON.parse(saved) as CompletionStore : {};
  });
  const today = new Date();
  const initialIndex = useMemo(() => {
    const current = plan.findIndex(w => {
      const start = parseLocalDate(w.startDate); const end = new Date(start); end.setDate(end.getDate()+6);
      return today >= start && today <= end;
    });
    return current >= 0 ? current : 0;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [editing, setEditing] = useState<DailyWorkout | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => localStorage.setItem(PLAN_KEY, JSON.stringify(plan)), [plan]);
  useEffect(() => localStorage.setItem(COMPLETION_KEY, JSON.stringify(completions)), [completions]);

  const week = plan[selectedIndex];
  const weekStart = parseLocalDate(week.startDate);
  const progress = weeklyCompletion(week, completions);
  const planned = plannedMileage(week);
  const completed = completedMileage(week, completions);
  const gymCount = strengthCompleted(week, completions);
  const requiredCount = week.workouts.filter(w => w.required).length;
  const completedCount = week.workouts.filter(w => w.required && completions[w.id]?.completed).length;
  const chartData = plan.slice(0, selectedIndex + 1).map(w => ({ week: `W${w.weekNumber}`, mileage: completedMileage(w, completions), planned: plannedMileage(w) }));

  const toggleWorkout = (id: string) => setCompletions(prev => ({ ...prev, [id]: { ...prev[id], completed: !prev[id]?.completed, notes: prev[id]?.notes ?? '' } }));
  const updateWorkoutNotes = (id: string, notes: string) => setCompletions(prev => ({ ...prev, [id]: { ...prev[id], completed: prev[id]?.completed ?? false, notes } }));

  const updateExerciseWeight = (workoutId: string, exerciseId: string, weight: string) => setCompletions(prev => {
    const prior = prev[workoutId];
    const exercise = prior?.exercises?.[exerciseId];
    return {...prev,[workoutId]:{completed:prior?.completed??false,notes:prior?.notes??'',exercises:{...prior?.exercises,[exerciseId]:{completed:exercise?.completed??false,weight,notes:exercise?.notes??''}}}};
  });

  const toggleExercise = (workoutId: string, exerciseId: string, checked: boolean) => setCompletions(prev => {
    const prior = prev[workoutId];
    const exercise = prior?.exercises?.[exerciseId];
    return {...prev,[workoutId]:{completed:prior?.completed??false,notes:prior?.notes??'',exercises:{...prior?.exercises,[exerciseId]:{completed:checked,weight:exercise?.weight??'',notes:exercise?.notes??''}}}};
  });

  const saveWorkout = (workout: DailyWorkout) => {
    setPlan(prev => prev.map(w => w.id === week.id ? { ...w, workouts: w.workouts.some(x => x.id === workout.id) ? w.workouts.map(x => x.id === workout.id ? workout : x) : [...w.workouts, workout] } : w));
    setEditing(null); setShowAdd(false);
  };
  const removeWorkout = (id: string) => {
    setPlan(prev => prev.map(w => w.id === week.id ? { ...w, workouts: w.workouts.filter(x => x.id !== id) } : w));
  };

  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate()+6);

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Route size={21}/></div>
        <div><h1>Marathon + Strength Planner</h1><p>Road to Sub-4</p></div>
      </div>
      <div className="header-actions">
        <button className="today-btn" onClick={() => setSelectedIndex(initialIndex)}><CalendarDays size={16}/> Today</button>
        <div className="week-nav">
          <button aria-label="Previous week" onClick={() => setSelectedIndex(i => Math.max(0,i-1))} disabled={selectedIndex===0}><ChevronLeft size={18}/></button>
          <select aria-label="Training week" value={selectedIndex} onChange={e => setSelectedIndex(Number(e.target.value))}>
            {plan.map((w,i) => <option value={i} key={w.id}>Week {w.weekNumber} · {formatDate(w.startDate)}</option>)}
          </select>
          <button aria-label="Next week" onClick={() => setSelectedIndex(i => Math.min(plan.length-1,i+1))} disabled={selectedIndex===plan.length-1}><ChevronRight size={18}/></button>
        </div>
      </div>
    </header>

    <div className="date-line"><span>Selected training week</span><strong>{formatDate(weekStart,{weekday:'short',month:'short',day:'numeric'})} — {formatDate(weekEnd,{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</strong><span className="race-date">Race · March 7, 2027</span></div>

    <section className="summary-grid">
      <article className="summary-card"><div className="summary-icon teal"><Gauge size={20}/></div><div><span>Weekly completion</span><strong>{progress}%</strong><div className="progress-track"><i style={{width:`${progress}%`}}/></div></div></article>
      <article className="summary-card"><div className="summary-icon blue"><Dumbbell size={20}/></div><div><span>Workouts complete</span><strong>{completedCount} <small>/ {requiredCount}</small></strong></div></article>
      <article className="summary-card"><div className="summary-icon green"><Route size={20}/></div><div><span>Running mileage</span><strong>{completed.toFixed(1)} <small>/ {planned.toFixed(1)} mi</small></strong></div></article>
      <article className="summary-card"><div className="summary-icon amber"><Clock3 size={20}/></div><div><span>Strength sessions</span><strong>{gymCount} <small>/ 4</small></strong></div></article>
      <article className="summary-card"><div className="summary-icon coral"><Trophy size={20}/></div><div><span>Race countdown</span><strong>{getDaysUntilRace(today)} <small>days</small></strong></div></article>
    </section>

    <section className="main-grid">
      <article className="card focus-card"><div className="card-heading"><div><span className="eyebrow">THIS WEEK</span><h2>Weekly focus</h2></div><span className="phase-pill">Week {week.weekNumber}</span></div><div className="focus-body"><div><span>Training phase</span><strong>{week.phase}</strong><p>{week.objective}</p></div><div className="focus-stats"><div><span>Weekly mileage</span><strong>{week.mileage} mi</strong></div><div><span>Long run</span><strong>{week.longDistance} mi</strong></div></div></div><div className="recovery-note"><span>Recovery note</span><p>{week.recovery}</p></div></article>

      <article className="card pace-card"><div className="card-heading"><div><span className="eyebrow">PACE GUIDE</span><h2>Pace progression</h2></div></div><div className="pace-grid"><div><span>Easy</span><strong>{week.paces.easy}</strong><small>Conversational</small></div><div><span>Tempo</span><strong>{week.paces.tempo}</strong><small>Controlled, hard</small></div><div><span>Intervals</span><strong>{week.paces.intervals}</strong><small>Fast with recovery</small></div><div className="goal"><span>Marathon goal</span><strong>{week.paces.marathon}</strong><small>~Sub-4 pace</small></div></div></article>
    </section>

    <section className="card schedule-card">
      <div className="card-heading"><div><span className="eyebrow">TRAINING PLAN</span><h2>Weekly schedule</h2></div><button className="add-btn" onClick={() => setShowAdd(true)}><Plus size={16}/> Add workout</button></div>
      <div className="schedule-list">
        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((dayName, day) => {
          const dayWorkouts = week.workouts.filter(w => w.day === day);
          const date = new Date(weekStart); date.setDate(date.getDate()+day);
          const isToday = date.toDateString() === today.toDateString();
          if (dayWorkouts.length === 0) return <div className="day-row rest-row" key={day}><DayLabel name={dayName} date={date} today={isToday}/><div className="rest-content"><span className="category rest">Rest</span><strong>Open for recovery</strong><button onClick={() => setEditing({id:`w${week.weekNumber}-${day}`,day,name:'Rest',category:'Rest',details:'Open recovery day',required:false,notes:''})}>Add workout</button></div></div>;
          return <div className={`day-row ${dayWorkouts.every(w => completions[w.id]?.completed) ? 'is-complete' : ''}`} key={`day-${day}`}>
            <DayLabel name={dayName} date={date} today={isToday}/>
            <div className="day-workouts">
            {dayWorkouts.map(workout => {
              const completed = completions[workout.id]?.completed;
              return <article className="workout-row" key={workout.id}>
                <button className={`check ${completed?'checked':''}`} aria-label={`Mark ${workout.name} complete`} onClick={() => toggleWorkout(workout.id)}>{completed?'✓':''}</button>
                <div className="workout-main">
                  <div className="workout-title"><span className={`category ${workout.category.toLowerCase().replaceAll(' ','-')}`}>{workout.category}</span><strong>{workout.name}</strong></div>
                  <p>{workout.details}</p>
                  {workout.segments && <details className="run-details"><summary>{workout.distance ? `${workout.distance} miles` : workout.duration}{workout.rpe ? ` · ${workout.rpe}` : ''} · View workout</summary><div className="segment-list">{workout.segments.map((segment,index) => <div className="run-segment" key={`${segment.kind}-${index}`}><span>{segment.label}</span><strong>{formatSegmentDistance(segment)}{segment.estimated ? ' (estimated)' : ''}</strong><small>{[segment.pace, segment.effort].filter(Boolean).join(' · ')}</small></div>)}</div>{workout.fueling && <p className="fueling"><strong>Fueling:</strong> {workout.fueling}</p>}</details>}
                  {workout.exercises && <details className="exercise-list"><summary>{workout.exercises.length} exercises · View details</summary>{workout.exercises.map(ex => {
                    const exerciseState = completions[workout.id]?.exercises?.[ex.id];
                    return <label key={ex.id}><span>{ex.name}</span><small>{ex.sets} × {ex.reps}</small><input aria-label={`${ex.name} weight`} value={exerciseState?.weight ?? ex.weight} placeholder="Weight" onChange={e => updateExerciseWeight(workout.id, ex.id, e.target.value)} /><input aria-label={`${ex.name} completed`} type="checkbox" checked={exerciseState?.completed ?? ex.completed} onChange={e => toggleExercise(workout.id, ex.id, e.target.checked)} /></label>;
                  })}</details>}
                  <input className="notes" value={completions[workout.id]?.notes ?? workout.notes} onChange={e => updateWorkoutNotes(workout.id,e.target.value)} aria-label={`Notes for ${workout.name}`}/>
                </div>
                <div className="workout-meta"><span>{workout.distance ? `${workout.distance} mi` : workout.duration}</span><small>{workout.pace ?? ''}</small></div>
                <button className="edit-link" onClick={() => setEditing(workout)}>Edit</button>
              </article>;
            })}
            </div>
          </div>;
        })}
      </div>
    </section>

    <section className="bottom-grid"><article className="card table-card"><div className="card-heading"><div><span className="eyebrow">RUN PLAN</span><h2>Easy & long-run targets</h2></div></div><div className="table-wrap"><table><thead><tr><th>Week</th><th>Easy</th><th>Long</th><th>Weekly mi</th><th>Objective</th></tr></thead><tbody>{plan.slice(Math.max(0,selectedIndex-3),selectedIndex+4).map(w => <tr key={w.id} className={w.id===week.id?'active-row':''}><td>W{w.weekNumber}</td><td>{w.easyDistance} mi</td><td>{w.longDistance} mi</td><td>{w.mileage} mi</td><td>{w.phase}</td></tr>)}</tbody></table></div></article>
      <article className="card chart-card"><div className="card-heading"><div><span className="eyebrow">PROGRESS</span><h2>Running mileage</h2></div><div className="chart-total"><strong>{plan.reduce((s,w)=>s+completedMileage(w,completions),0).toFixed(1)} mi</strong><span>completed</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11}}/><Tooltip/><Line type="monotone" dataKey="planned" stroke="#b8c8c6" strokeDasharray="4 4" dot={false}/><Line type="monotone" dataKey="mileage" stroke="#16837d" strokeWidth={3} dot={{r:3,fill:'#16837d'}}/></LineChart></ResponsiveContainer></div></article></section>

    <section className="race-grid"><article className="race-card"><div className="race-ring"><strong>{getDaysUntilRace(today)}</strong><span>days</span></div><div><span>RACE COUNTDOWN</span><h2>March 7, 2027</h2><p>Chicago Marathon · 26.2 miles</p></div></article><article className="goal-card"><span>RACE GOAL</span><h2>Sub-4:00</h2><div><p><strong>3:59:59</strong><small>Goal time</small></p><p><strong>9:09 /mi</strong><small>Goal pace</small></p><p><strong>1:59:08</strong><small>Recent half</small></p></div></article></section>

    {(editing || showAdd) && <WorkoutModal workout={editing ?? {id:`${week.id}-new-${week.workouts.length}`,day:0,name:'New workout',category:'Easy Run',details:'',duration:'',required:true,notes:''}} onClose={()=>{setEditing(null);setShowAdd(false)}} onSave={saveWorkout} onDelete={editing?()=>{removeWorkout(editing.id);setEditing(null)}:undefined}/>} 
  </main>;
}

function DayLabel({name,date,today}:{name:string,date:Date,today:boolean}) { return <div className="day-label"><span>{name.slice(0,3)}</span><strong>{date.getDate()}</strong>{today&&<small>TODAY</small>}</div> }

function WorkoutModal({workout,onClose,onSave,onDelete}:{workout:DailyWorkout,onClose:()=>void,onSave:(w:DailyWorkout)=>void,onDelete?:()=>void}) {
  const [draft,setDraft]=useState<DailyWorkout>({...workout});
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label="Edit workout" onMouseDown={e=>e.stopPropagation()}><div className="modal-heading"><h2>Edit workout</h2><button aria-label="Close" onClick={onClose}><X size={18}/></button></div><div className="form-grid"><label>Workout name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/></label><label>Category<select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value as WorkoutCategory})}>{categories.map(c=><option key={c}>{c}</option>)}</select></label><label>Day<select value={draft.day} onChange={e=>setDraft({...draft,day:Number(e.target.value)})}>{['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d,i)=><option value={i} key={d}>{d}</option>)}</select></label><label>Distance (mi)<input type="number" step="0.5" value={draft.distance??''} onChange={e=>setDraft({...draft,distance:e.target.value?Number(e.target.value):undefined})}/></label><label>Duration<input value={draft.duration??''} onChange={e=>setDraft({...draft,duration:e.target.value})}/></label><label>Pace / intensity<input value={draft.pace??''} onChange={e=>setDraft({...draft,pace:e.target.value})}/></label><label className="full">Details<input value={draft.details} onChange={e=>setDraft({...draft,details:e.target.value})}/></label><label className="full">Notes<textarea value={draft.notes} onChange={e=>setDraft({...draft,notes:e.target.value})}/></label><label className="full checkbox-label"><input type="checkbox" checked={draft.required} onChange={e=>setDraft({...draft,required:e.target.checked})}/> Required workout</label></div><div className="modal-actions">{onDelete&&<button className="delete-btn" onClick={onDelete}>Remove</button>}<button className="cancel-btn" onClick={onClose}>Cancel</button><button className="save-btn" onClick={()=>onSave(draft)}>Save workout</button></div></div></div>
}

function formatSegmentDistance(segment: RunSegment): string {
  const pieces: string[] = [];
  if (segment.repetitions) pieces.push(`${segment.repetitions} ×`);
  if (segment.distanceMeters) pieces.push(`${segment.distanceMeters} m`);
  else if (segment.distanceMiles) pieces.push(`${segment.distanceMiles} mi`);
  else if (segment.durationSeconds) pieces.push(`${segment.durationSeconds} sec`);
  else if (segment.durationMinutes) pieces.push(`${segment.durationMinutes} min`);
  return pieces.join(' ');
}

export default App;
