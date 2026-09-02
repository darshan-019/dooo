/* =====================================================
   DATA LAYER & APP STATE
   Storage, task model, recurrence expansion, in-memory state
   ===================================================== */
/* =========================================================
   DATA LAYER
   ========================================================= */
const STORAGE_KEY = 'ledger_app_data_v1';

const DEFAULT_CATEGORIES = [
  {id:'cat_english', name:'English', color:'#5b9bd5'},
  {id:'cat_dsa', name:'DSA', color:'#d4a24c'},
  {id:'cat_gym', name:'Gym', color:'#d16565'},
  {id:'cat_project', name:'Project', color:'#7a8ef7'},
  {id:'cat_reading', name:'Reading', color:'#9b7ed4'},
  {id:'cat_sleep', name:'Sleep', color:'#5c6272'},
  {id:'cat_meal', name:'Meal', color:'#5fb489'},
  {id:'cat_break', name:'Break', color:'#7ea8d4'},
  {id:'cat_practice', name:'Practice', color:'#e0a458'},
  {id:'cat_fresh', name:'Fresh', color:'#c77dbf'},
  {id:'cat_college', name:'College', color:'#6ec6c6'},
  {id:'cat_study', name:'Study', color:'#8b7e74'},
  {id:'cat_other', name:'Other', color:'#9198a8'},
];

const CATEGORY_COLORS = ['#5b9bd5','#d4a24c','#d16565','#9b7ed4','#5c6272','#5fb489','#7ea8d4','#e0a458','#c77dbf','#6ec6c6'];

function uid(prefix){ return prefix+'_'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

function pad(n){ return String(n).padStart(2,'0'); }
function dateKey(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
function parseKey(key){ const [y,m,d] = key.split('-').map(Number); return new Date(y, m-1, d); }
function todayKey(){ return dateKey(new Date()); }
function addDays(key, n){ const d = parseKey(key); d.setDate(d.getDate()+n); return dateKey(d); }
function fmtLongDate(key){
  const d = parseKey(key);
  return d.toLocaleDateString('en-US',{weekday:'long', day:'numeric', month:'long', year:'numeric'});
}
function fmtShortDate(key){
  const d = parseKey(key);
  return d.toLocaleDateString('en-US',{weekday:'short', day:'numeric', month:'short'});
}
function to12h(t){
  if(!t) return '';
  let [h,m] = t.split(':').map(Number);
  const ap = h>=12 ? 'PM':'AM';
  h = h%12; if(h===0) h=12;
  return h+':'+pad(m)+' '+ap;
}
function timeToMinutes(t){ const [h,m]=t.split(':').map(Number); return h*60+m; }

function ensureProjectCategoryAndSundaySchedule(db){
  if(!db || !Array.isArray(db.tasks)) return db;

  if(!db.categories || !db.categories.some(c=>c.id === 'cat_project')){
    db.categories = [...(db.categories || []), {id:'cat_project', name:'Project', color:'#7a8ef7'}];
  }

  if(!Array.isArray(db.routines)) db.routines = [];

  ensureWeeklyRoutines(db);

  return db;
}

function ensureWeeklyRoutines(db){
  if(!Array.isArray(db.routines)) db.routines = [];

  const weeklyRoutineData = {
    Monday: [
      {name:'Sleep', start:'01:00', end:'07:00', category:'cat_sleep'},
      {name:'Practice', start:'07:00', end:'08:00', category:'cat_practice'},
      {name:'Fresh', start:'08:00', end:'09:00', category:'cat_fresh'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'DSA', start:'10:00', end:'12:00', category:'cat_dsa'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'College', start:'13:00', end:'15:00', category:'cat_college'},
      {name:'Study', start:'15:00', end:'16:00', category:'cat_study'},
      {name:'DSA', start:'16:00', end:'17:00', category:'cat_dsa'},
      {name:'Gym', start:'17:00', end:'19:00', category:'cat_gym'},
      {name:'English', start:'19:00', end:'20:00', category:'cat_english'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ],
    Tuesday: [
      {name:'Sleep', start:'01:00', end:'07:00', category:'cat_sleep'},
      {name:'Practice', start:'07:00', end:'08:00', category:'cat_practice'},
      {name:'Fresh', start:'08:00', end:'09:00', category:'cat_fresh'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'DSA', start:'10:00', end:'12:00', category:'cat_dsa'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'Study', start:'13:00', end:'15:00', category:'cat_study'},
      {name:'College', start:'15:00', end:'17:00', category:'cat_college'},
      {name:'Gym', start:'17:00', end:'19:00', category:'cat_gym'},
      {name:'English', start:'19:00', end:'20:00', category:'cat_english'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ],
    Wednesday: [
      {name:'Sleep', start:'01:00', end:'07:00', category:'cat_sleep'},
      {name:'Practice', start:'07:00', end:'08:00', category:'cat_practice'},
      {name:'Fresh', start:'08:00', end:'09:00', category:'cat_fresh'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'DSA', start:'10:00', end:'12:00', category:'cat_dsa'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'Study', start:'13:00', end:'16:00', category:'cat_study'},
      {name:'DSA', start:'16:00', end:'17:00', category:'cat_dsa'},
      {name:'Gym', start:'17:00', end:'19:00', category:'cat_gym'},
      {name:'English', start:'19:00', end:'20:00', category:'cat_english'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ],
    Thursday: [
      {name:'Sleep', start:'01:00', end:'07:00', category:'cat_sleep'},
      {name:'Practice', start:'07:00', end:'08:00', category:'cat_practice'},
      {name:'Fresh', start:'08:00', end:'09:00', category:'cat_fresh'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'College', start:'10:00', end:'12:00', category:'cat_college'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'Study', start:'13:00', end:'16:00', category:'cat_study'},
      {name:'DSA', start:'16:00', end:'17:00', category:'cat_dsa'},
      {name:'Gym', start:'17:00', end:'19:00', category:'cat_gym'},
      {name:'English', start:'19:00', end:'20:00', category:'cat_english'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ],
    Friday: [
      {name:'Sleep', start:'01:00', end:'07:00', category:'cat_sleep'},
      {name:'Practice', start:'07:00', end:'08:00', category:'cat_practice'},
      {name:'Fresh', start:'08:00', end:'09:00', category:'cat_fresh'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'DSA', start:'10:00', end:'12:00', category:'cat_dsa'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'Study', start:'13:00', end:'15:00', category:'cat_study'},
      {name:'College', start:'15:00', end:'17:00', category:'cat_college'},
      {name:'Gym', start:'17:00', end:'19:00', category:'cat_gym'},
      {name:'English', start:'19:00', end:'20:00', category:'cat_english'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ],
    Saturday: [
      {name:'Sleep', start:'01:00', end:'07:00', category:'cat_sleep'},
      {name:'Practice', start:'07:00', end:'08:00', category:'cat_practice'},
      {name:'Fresh', start:'08:00', end:'09:00', category:'cat_fresh'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'College', start:'10:00', end:'12:00', category:'cat_college'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'Study', start:'13:00', end:'16:00', category:'cat_study'},
      {name:'DSA', start:'16:00', end:'17:00', category:'cat_dsa'},
      {name:'Gym', start:'17:00', end:'19:00', category:'cat_gym'},
      {name:'English', start:'19:00', end:'20:00', category:'cat_english'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ],
    Sunday: [
      {name:'Sleep', start:'01:00', end:'08:00', category:'cat_sleep'},
      {name:'Practice', start:'08:00', end:'09:00', category:'cat_practice'},
      {name:'English', start:'09:00', end:'10:00', category:'cat_english'},
      {name:'DSA', start:'10:00', end:'12:00', category:'cat_dsa'},
      {name:'Lunch', start:'12:00', end:'13:00', category:'cat_meal'},
      {name:'Study', start:'13:00', end:'16:00', category:'cat_study'},
      {name:'DSA', start:'16:00', end:'17:00', category:'cat_dsa'},
      {name:'Project', start:'17:00', end:'20:00', category:'cat_project'},
      {name:'Dinner', start:'20:00', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    ]
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach(day => {
    const routineExists = db.routines.some(r => r.name === `${day} Routine`);
    if(!routineExists && weeklyRoutineData[day]){
      db.routines.push({
        id: uid('routine'),
        name: `${day} Routine`,
        tasks: weeklyRoutineData[day].map(t => ({id: uid('rt'), ...t}))
      });
    }
  });

  return db;
}

function seedData(){
  const cats = DEFAULT_CATEGORIES;

  return {
    version: 1,
    categories: cats,
    routines: [],
    tasks: [],
    exceptions: {},
    completions: {}
  };
}

let DB = load();

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && parsed.tasks){
        ensureProjectCategoryAndSundaySchedule(parsed);
        save(parsed);
        return parsed;
      }
    }
  }catch(e){ console.error('load error', e); }
  const seeded = seedData();
  ensureProjectCategoryAndSundaySchedule(seeded);
  save(seeded);
  return seeded;
}
function save(db){
  db = db || DB;
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
  catch(e){ console.error('save error', e); toast('Storage error — changes may not persist'); }
}

/* =========================================================
   TASK EXPANSION — turn stored (possibly recurring) tasks
   into concrete per-date instances for a given date
   ========================================================= */

function seriesOccursOnDate(task, key){
  if(!task.repeat || task.repeat.type==='none'){
    return task.date === key;
  }

  const dow = parseKey(key).getDay();

  const r = task.repeat;
  const start = r.start || task.date;
  if(key < start) return false;
  if(r.end && key > r.end) return false;

  if(r.type === 'daily') return true;

  if(r.type === 'weekly'){
    return (r.weekdays||[]).includes(dow);
  }
  if(r.type === 'custom'){
    const diffDays = Math.round((parseKey(key) - parseKey(start)) / 86400000);
    const interval = r.interval || 2;
    return diffDays >= 0 && diffDays % interval === 0;
  }
  return false;
}

function isExcepted(seriesId, key){
  return DB.exceptions[seriesId] && DB.exceptions[seriesId][key] === 'deleted';
}

// Returns array of "instances" for a date: real objects with a synthetic id like taskId__key for recurring
function getInstancesForDate(key){
  const out = [];
  DB.tasks.forEach(task=>{
    if(task.overriddenBy) return; // superseded by a "future" edit split
    if(!seriesOccursOnDate(task, key)) return;
    if(task.seriesId && isExcepted(task.seriesId, key)) return;

    const instanceId = task.date === key ? task.id : task.id+'__'+key;
    const completionKey = instanceId;
    const completed = task.date === key
      ? !!task.completed
      : !!(DB.completions[completionKey]);

    out.push({
      instanceId,
      sourceTaskId: task.id,
      seriesId: task.seriesId || null,
      dateKey: key,
      name: task.name,
      description: task.description||'',
      start: task.start,
      end: task.end,
      category: task.category,
      priority: task.priority||'medium',
      repeat: task.repeat || {type:'none'},
      reminder: task.reminder||'',
      notes: task.notes||'',
      completed,
      isRecurring: !!(task.repeat && task.repeat.type!=='none')
    });
  });
  out.sort((a,b)=> timeToMinutes(a.start) - timeToMinutes(b.start));
  return out;
}

function toggleComplete(instanceId, sourceTaskId, dateKey){
  const task = DB.tasks.find(t=>t.id===sourceTaskId);
  if(!task) return;
  if(task.date === dateKey){
    task.completed = !task.completed;
  } else {
    DB.completions[instanceId] = !DB.completions[instanceId];
  }
  save();
}



/* =========================================================
   STATE
   ========================================================= */
let currentDate = todayKey();
let currentView = 'dashboard';
let calMonthCursor = new Date();
let weekCursor = todayKey();
let histMonthCursor = new Date();
let editingContext = null; // {mode:'add'|'edit', task, instance}
let pendingDeleteInstance = null;
let editingRoutine = null;
let routineDraftTasks = [];

