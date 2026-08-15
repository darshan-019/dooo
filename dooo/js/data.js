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

  const sundayRoutineExists = db.routines.some(r => r.id === 'routine_sunday' || r.name === 'Sunday Routine');
  if(!sundayRoutineExists){
    const sundayRoutineTasks = [
      {name:'English', start:'07:00', end:'08:30', category:'cat_english'},
      {name:'Break', start:'08:30', end:'09:00', category:'cat_break'},
      {name:'English', start:'09:00', end:'12:00', category:'cat_english'},
      {name:'Lunch', start:'12:00', end:'12:30', category:'cat_meal'},
      {name:'English', start:'12:30', end:'16:00', category:'cat_english'},
      {name:'Sleep', start:'16:00', end:'17:00', category:'cat_sleep'},
      {name:'Project', start:'17:00', end:'19:00', category:'cat_project'},
      {name:'Reading', start:'19:00', end:'20:30', category:'cat_reading'},
      {name:'Dinner', start:'20:30', end:'21:00', category:'cat_meal'},
      {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
      {name:'Sleep', start:'00:00', end:'07:00', category:'cat_sleep'},
    ];
    db.routines.push({
      id: 'routine_sunday',
      name: 'Sunday Routine',
      tasks: sundayRoutineTasks.map(t => ({id: uid('rt'), ...t}))
    });
  }

  const sundayDay = 0;
  db.tasks = db.tasks.filter(task => {
    if(task.name === 'Gym' && task.start === '17:00' && task.end === '19:00' && task.repeat && task.repeat.type === 'weekly' && Array.isArray(task.repeat.weekdays) && task.repeat.weekdays.includes(sundayDay)){
      task.repeat.weekdays = task.repeat.weekdays.filter(d => d !== sundayDay);
      return true;
    }
    return true;
  });

  const sundayProject = db.tasks.find(task =>
    task.name === 'Project' &&
    task.start === '17:00' &&
    task.end === '19:00' &&
    task.category === 'cat_project' &&
    task.repeat &&
    task.repeat.type === 'weekly' &&
    Array.isArray(task.repeat.weekdays) &&
    task.repeat.weekdays.includes(sundayDay)
  );

  if(!sundayProject){
    const start = todayKey();
    db.tasks.push({
      id: uid('task'),
      seriesId: uid('series'),
      name: 'Project',
      description: '',
      start: '17:00',
      end: '19:00',
      date: start,
      category: 'cat_project',
      priority: 'medium',
      reminder: '',
      notes: '',
      completed: false,
      repeat: {type:'weekly', weekdays:[0], interval:1, start, end:''}
    });
  }

  return db;
}

function seedData(){
  const cats = DEFAULT_CATEGORIES;
  const catByName = {};
  cats.forEach(c=>catByName[c.name.toLowerCase()]=c.id);

  const startKey = todayKey();
  const dailyRoutineTasks = [
    {name:'English', start:'07:00', end:'08:30', category:'cat_english'},
    {name:'Break', start:'08:30', end:'09:00', category:'cat_break'},
    {name:'English', start:'09:00', end:'12:00', category:'cat_english'},
    {name:'Lunch', start:'12:00', end:'12:30', category:'cat_meal'},
    {name:'English', start:'12:30', end:'16:00', category:'cat_english'},
    {name:'Sleep', start:'16:00', end:'17:00', category:'cat_sleep'},
    {name:'Reading', start:'19:00', end:'20:30', category:'cat_reading'},
    {name:'Dinner', start:'20:30', end:'21:00', category:'cat_meal'},
    {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    {name:'Sleep', start:'00:00', end:'07:00', category:'cat_sleep'},
  ];

  const routine = {
    id: 'routine_default',
    name: 'My Daily Routine',
    tasks: dailyRoutineTasks.map(t=>({id:uid('rt'), ...t}))
  };

  const sundayRoutineTasks = [
    ...dailyRoutineTasks,
    {name:'Project', start:'17:00', end:'19:00', category:'cat_project'},
    {name:'Reading', start:'19:00', end:'20:30', category:'cat_reading'},
    {name:'Dinner', start:'20:30', end:'21:00', category:'cat_meal'},
    {name:'DSA', start:'21:00', end:'23:59', category:'cat_dsa'},
    {name:'Sleep', start:'00:00', end:'07:00', category:'cat_sleep'},
  ];

  const sundayRoutine = {
    id: 'routine_sunday',
    name: 'Sunday Routine',
    tasks: sundayRoutineTasks.map(t=>({id:uid('rt'), ...t}))
  };

  const weeklyGym = {
    id: uid('task'),
    seriesId: uid('series'),
    name: 'Gym',
    description: '',
    start: '17:00',
    end: '19:00',
    date: startKey,
    category: 'cat_gym',
    priority: 'medium',
    reminder: '',
    notes: '',
    completed: false,
    repeat: {type:'weekly', weekdays:[1,2,3,4,5,6], interval:1, start:startKey, end:''}
  };

  const sundayProject = {
    id: uid('task'),
    seriesId: uid('series'),
    name: 'Project',
    description: '',
    start: '17:00',
    end: '19:00',
    date: startKey,
    category: 'cat_project',
    priority: 'medium',
    reminder: '',
    notes: '',
    completed: false,
    repeat: {type:'weekly', weekdays:[0], interval:1, start:startKey, end:''}
  };

  const tasks = [
    ...dailyRoutineTasks.map(t => ({
      id: uid('task'),
      seriesId: uid('series'),
      name: t.name,
      description: '',
      start: t.start,
      end: t.end,
      date: startKey,
      category: t.category,
      priority: 'medium',
      reminder: '',
      notes: '',
      completed: false,
      repeat: {type:'daily', weekdays:[], interval:1, start:startKey, end:''}
    })),
    weeklyGym,
    sundayProject
  ];

  return {
    version: 1,
    categories: cats,
    routines: [routine, sundayRoutine],
    tasks: tasks,
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
  if((task.name === 'Gym' || task.category === 'cat_gym') && dow === 0){
    return false;
  }

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

