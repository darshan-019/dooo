/* =====================================================
   TASK MODAL
   Add/Edit task form, recurrence fields, edit-scope handling
   ===================================================== */
/* =========================================================
   TASK MODAL (ADD/EDIT)
   ========================================================= */
const taskModal = document.getElementById('taskModalOverlay');
let selectedPriority = 'medium';
let selectedRepeat = 'none';
let selectedWeekdays = [];

function populateCategorySelect(sel){
  sel.innerHTML = DB.categories.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
}

function openAddTask(){
  editingContext = {mode:'add'};
  document.getElementById('taskModalTitle').textContent = 'Add Task';
  document.getElementById('taskForm').reset();
  populateCategorySelect(document.getElementById('tCategory'));
  document.getElementById('tDate').value = currentDate;
  selectedPriority='medium'; selectedRepeat='none'; selectedWeekdays=[];
  syncPriorityChips(); syncRepeatChips(); syncWeekdayButtons();
  toggleRepeatFields();
  document.getElementById('tRepeatStart').value = currentDate;
  taskModal.classList.add('active');
}

function openEditTask(inst){
  const task = DB.tasks.find(t=>t.id===inst.sourceTaskId);
  if(!task) return;

  if(inst.isRecurring){
    openScopeModal('edit', inst, task);
  } else {
    fillTaskForm(task, inst);
    taskModal.classList.add('active');
  }
}

function fillTaskForm(task, inst){
  editingContext = {mode:'edit', task, inst};
  document.getElementById('taskModalTitle').textContent = 'Edit Task';
  populateCategorySelect(document.getElementById('tCategory'));
  document.getElementById('tName').value = task.name;
  document.getElementById('tDesc').value = task.description||'';
  document.getElementById('tStart').value = task.start;
  document.getElementById('tEnd').value = task.end;
  document.getElementById('tDate').value = inst ? inst.dateKey : task.date;
  document.getElementById('tCategory').value = task.category;
  selectedPriority = task.priority || 'medium';
  document.getElementById('tReminder').value = task.reminder||'';
  document.getElementById('tNotes').value = task.notes||'';
  selectedRepeat = task.repeat ? task.repeat.type : 'none';
  selectedWeekdays = (task.repeat && task.repeat.weekdays) ? [...task.repeat.weekdays] : [];
  document.getElementById('tInterval').value = (task.repeat && task.repeat.interval) || 2;
  document.getElementById('tRepeatStart').value = (task.repeat && task.repeat.start) || task.date;
  document.getElementById('tRepeatEnd').value = (task.repeat && task.repeat.end) || '';
  syncPriorityChips(); syncRepeatChips(); syncWeekdayButtons();
  toggleRepeatFields();
}

function syncPriorityChips(){
  document.querySelectorAll('#tPriority .radio-chip').forEach(b=>b.classList.toggle('selected', b.dataset.val===selectedPriority));
}
function syncRepeatChips(){
  document.querySelectorAll('#tRepeat .radio-chip').forEach(b=>b.classList.toggle('selected', b.dataset.val===selectedRepeat));
}
function syncWeekdayButtons(){
  document.querySelectorAll('#tWeekdays button').forEach(b=>b.classList.toggle('selected', selectedWeekdays.includes(Number(b.dataset.d))));
}
function toggleRepeatFields(){
  document.getElementById('tWeekdayField').style.display = selectedRepeat==='weekly' ? '' : 'none';
  document.getElementById('tIntervalField').style.display = selectedRepeat==='custom' ? '' : 'none';
  document.getElementById('tRepeatRangeField').style.display = selectedRepeat==='none' ? 'none' : '';
}

document.querySelectorAll('#tPriority .radio-chip').forEach(b=>b.addEventListener('click', ()=>{ selectedPriority=b.dataset.val; syncPriorityChips(); }));
document.querySelectorAll('#tRepeat .radio-chip').forEach(b=>b.addEventListener('click', ()=>{ selectedRepeat=b.dataset.val; syncRepeatChips(); toggleRepeatFields(); }));
document.querySelectorAll('#tWeekdays button').forEach(b=>b.addEventListener('click', ()=>{
  const d = Number(b.dataset.d);
  const idx = selectedWeekdays.indexOf(d);
  if(idx>-1) selectedWeekdays.splice(idx,1); else selectedWeekdays.push(d);
  syncWeekdayButtons();
}));

document.getElementById('addTaskBtn').addEventListener('click', openAddTask);
document.getElementById('taskCancelBtn').addEventListener('click', ()=> taskModal.classList.remove('active'));
taskModal.addEventListener('click', e=>{ if(e.target===taskModal) taskModal.classList.remove('active'); });

document.getElementById('taskForm').addEventListener('submit', function(e){
  e.preventDefault();
  
  const name = document.getElementById('tName').value.trim();
  if(!name){ toast('Task name required'); return; }
  
  const start = document.getElementById('tStart').value;
  const end = document.getElementById('tEnd').value;
  const date = document.getElementById('tDate').value;
  const category = document.getElementById('tCategory').value;
  const description = document.getElementById('tDesc').value.trim();
  const reminder = document.getElementById('tReminder').value;
  const notes = document.getElementById('tNotes').value.trim();

  if(!start || !end){ toast('Start and end time required'); return; }
  if(!date){ toast('Date required'); return; }
  if(!category){ toast('Category required'); return; }

  let repeat = {type:'none'};
  if(selectedRepeat!=='none'){
    repeat = {
      type: selectedRepeat,
      weekdays: selectedRepeat==='weekly' ? [...selectedWeekdays] : [],
      interval: selectedRepeat==='custom' ? Number(document.getElementById('tInterval').value||2) : undefined,
      start: document.getElementById('tRepeatStart').value || date,
      end: document.getElementById('tRepeatEnd').value || ''
    };
  }

  if(editingContext.mode==='add'){
    const seriesId = repeat.type!=='none' ? uid('series') : null;
    DB.tasks.push({
      id: uid('task'),
      seriesId,
      name,
      description,
      start,
      end,
      date,
      category,
      priority: selectedPriority,
      reminder,
      notes,
      completed: false,
      repeat
    });
    save();
    taskModal.classList.remove('active');
    toast('Task added ✓');
    currentDate = date;
    switchView('dashboard');
  } else {
    applyTaskEdit(editingContext.task, editingContext.inst, {name,description,start,end,date,category,priority:selectedPriority,reminder,notes,repeat}, editingContext.scope||'this');
    save();
    taskModal.classList.remove('active');
    toast('Task updated ✓');
    switchView('dashboard');
  }
});

/* Apply an edit respecting scope for recurring tasks */
function applyTaskEdit(task, inst, newVals, scope){
  if(!task.repeat || task.repeat.type==='none' || scope==='all' && !task.seriesId){
    Object.assign(task, newVals);
    return;
  }
  if(scope==='all'){
    Object.assign(task, newVals);
    // keep same seriesId
    task.repeat = newVals.repeat;
    return;
  }
  if(scope==='this'){
    // mark exception for that date, create standalone one-off task
    if(!DB.exceptions[task.seriesId]) DB.exceptions[task.seriesId] = {};
    DB.exceptions[task.seriesId][inst.dateKey] = 'deleted';
    DB.tasks.push({
      id: uid('task'), seriesId:null, ...newVals, date:newVals.date||inst.dateKey,
      completed: inst.completed
    });
    return;
  }
  if(scope==='future'){
    // end original series the day before this date, start new series from this date with new values
    const dayBefore = addDays(inst.dateKey, -1);
    if(task.repeat.start > dayBefore){
      // editing from the very start — just replace whole series
      Object.assign(task, newVals);
      task.repeat = newVals.repeat;
      return;
    }
    task.repeat = {...task.repeat, end: dayBefore};
    const newSeriesId = uid('series');
    DB.tasks.push({
      id: uid('task'), seriesId:newSeriesId, ...newVals,
      date: newVals.date||inst.dateKey,
      repeat: {...newVals.repeat, start: inst.dateKey, type: newVals.repeat.type==='none'?task.repeat.type:newVals.repeat.type}
    });
  }
}

/* =========================================================
   SCOPE MODAL (edit) — used before opening the edit form for recurring tasks
   ========================================================= */
const scopeModal = document.getElementById('scopeModalOverlay');
let scopeContext = null;
function openScopeModal(action, inst, task){
  scopeContext = {action, inst, task};
  scopeModal.classList.add('active');
}
document.getElementById('scopeCancelBtn').addEventListener('click', ()=>scopeModal.classList.remove('active'));
scopeModal.addEventListener('click', e=>{ if(e.target===scopeModal) scopeModal.classList.remove('active'); });
document.getElementById('scopeConfirmBtn').addEventListener('click', ()=>{
  const scope = document.querySelector('input[name="scope"]:checked').value;
  scopeModal.classList.remove('active');
  fillTaskForm(scopeContext.task, scopeContext.inst);
  editingContext.scope = scope;
  taskModal.classList.add('active');
});

