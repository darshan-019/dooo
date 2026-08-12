/* =====================================================
   ROUTINES
   Reusable routine templates + apply-to-date
   ===================================================== */
/* =========================================================
   ROUTINES
   ========================================================= */
function renderRoutines(){
  const grid = document.getElementById('routineGrid');
  grid.innerHTML = '';
  if(!DB.routines.length){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="big">↻</div><p>No routines yet. Create one to reuse across dates.</p></div>`;
    return;
  }
  DB.routines.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'routine-card';
    div.innerHTML = `
      <h3>${escapeHtml(r.name)}</h3>
      <div class="count">${r.tasks.length} task${r.tasks.length!==1?'s':''}</div>
      <div class="actions">
        <button class="btn-sm accent" data-apply="${r.id}">Apply</button>
        <button class="btn-sm" data-editr="${r.id}">Edit</button>
        <button class="btn-sm" data-delr="${r.id}">Delete</button>
      </div>
    `;
    grid.appendChild(div);
  });
  grid.querySelectorAll('[data-apply]').forEach(b=>b.addEventListener('click', ()=>openApplyRoutine(b.dataset.apply)));
  grid.querySelectorAll('[data-editr]').forEach(b=>b.addEventListener('click', ()=>openEditRoutine(b.dataset.editr)));
  grid.querySelectorAll('[data-delr]').forEach(b=>b.addEventListener('click', ()=>{
    if(confirm('Delete this routine template? (Does not affect already-applied tasks)')){
      DB.routines = DB.routines.filter(r=>r.id!==b.dataset.delr);
      save(); renderRoutines(); toast('Routine deleted');
    }
  }));
}

const routineModal = document.getElementById('routineModalOverlay');
document.getElementById('newRoutineBtn').addEventListener('click', ()=>{
  editingRoutine = null; routineDraftTasks = [];
  document.getElementById('routineModalTitle').textContent = 'New Routine';
  document.getElementById('rName').value = '';
  renderRoutineDraftTasks();
  routineModal.classList.add('active');
});
function openEditRoutine(id){
  const r = DB.routines.find(x=>x.id===id);
  if(!r) return;
  editingRoutine = r;
  routineDraftTasks = r.tasks.map(t=>({...t}));
  document.getElementById('routineModalTitle').textContent = 'Edit Routine';
  document.getElementById('rName').value = r.name;
  renderRoutineDraftTasks();
  routineModal.classList.add('active');
}
function renderRoutineDraftTasks(){
  const list = document.getElementById('routineTasksList');
  list.innerHTML = '';
  routineDraftTasks.forEach((t,idx)=>{
    const cat = catById(t.category);
    const row = document.createElement('div');
    row.className = 'hist-row';
    row.style.cursor = 'default';
    row.innerHTML = `
      <div style="flex:1;">
        <div style="font-weight:600; font-size:13px;">${escapeHtml(t.name)}</div>
        <div style="font-size:11.5px; color:var(--text-faint);">${to12h(t.start)} – ${to12h(t.end)} · ${escapeHtml(cat.name)}</div>
      </div>
      <button type="button" class="btn-sm" data-rmv="${idx}">Remove</button>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('[data-rmv]').forEach(b=>b.addEventListener('click', ()=>{
    routineDraftTasks.splice(Number(b.dataset.rmv),1);
    renderRoutineDraftTasks();
  }));
}
document.getElementById('routineCancelBtn').addEventListener('click', ()=>routineModal.classList.remove('active'));
routineModal.addEventListener('click', e=>{ if(e.target===routineModal) routineModal.classList.remove('active'); });
document.getElementById('routineSaveBtn').addEventListener('click', ()=>{
  const name = document.getElementById('rName').value.trim();
  if(!name){ toast('Give the routine a name'); return; }
  if(editingRoutine){
    editingRoutine.name = name;
    editingRoutine.tasks = routineDraftTasks;
  } else {
    DB.routines.push({id:uid('routine'), name, tasks:routineDraftTasks});
  }
  save();
  routineModal.classList.remove('active');
  renderRoutines();
  toast('Routine saved');
});

const routineTaskModal = document.getElementById('routineTaskModalOverlay');
document.getElementById('routineAddTaskBtn').addEventListener('click', ()=>{
  populateCategorySelect(document.getElementById('rtCategory'));
  document.getElementById('rtName').value='';
  document.getElementById('rtStart').value='';
  document.getElementById('rtEnd').value='';
  routineTaskModal.classList.add('active');
});
document.getElementById('rtCancelBtn').addEventListener('click', ()=>routineTaskModal.classList.remove('active'));
routineTaskModal.addEventListener('click', e=>{ if(e.target===routineTaskModal) routineTaskModal.classList.remove('active'); });
document.getElementById('rtSaveBtn').addEventListener('click', ()=>{
  const name = document.getElementById('rtName').value.trim();
  const start = document.getElementById('rtStart').value;
  const end = document.getElementById('rtEnd').value;
  if(!name || !start || !end){ toast('Fill in name, start and end'); return; }
  routineDraftTasks.push({id:uid('rt'), name, start, end, category:document.getElementById('rtCategory').value});
  renderRoutineDraftTasks();
  routineTaskModal.classList.remove('active');
});

const applyRoutineModal = document.getElementById('applyRoutineModalOverlay');
function openApplyRoutine(routineId){
  const sel = document.getElementById('applyRoutineSelect');
  sel.innerHTML = DB.routines.map(r=>`<option value="${r.id}" ${r.id===routineId?'selected':''}>${escapeHtml(r.name)}</option>`).join('');
  document.getElementById('applyRoutineDate').value = currentDate;
  applyRoutineModal.classList.add('active');
}
document.getElementById('applyRoutineBtn').addEventListener('click', ()=>openApplyRoutine(DB.routines[0] && DB.routines[0].id));
document.getElementById('applyRoutineCancelBtn').addEventListener('click', ()=>applyRoutineModal.classList.remove('active'));
applyRoutineModal.addEventListener('click', e=>{ if(e.target===applyRoutineModal) applyRoutineModal.classList.remove('active'); });
document.getElementById('applyRoutineConfirmBtn').addEventListener('click', ()=>{
  const routineId = document.getElementById('applyRoutineSelect').value;
  const date = document.getElementById('applyRoutineDate').value;
  const routine = DB.routines.find(r=>r.id===routineId);
  if(!routine || !date){ toast('Choose a routine and date'); return; }
  routine.tasks.forEach(t=>{
    DB.tasks.push({
      id: uid('task'), seriesId:null, name:t.name, description:'', start:t.start, end:t.end,
      date, category:t.category, priority:'medium', reminder:'', notes:'', completed:false,
      repeat:{type:'none'}
    });
  });
  save();
  applyRoutineModal.classList.remove('active');
  currentDate = date;
  toast('Routine applied to '+fmtShortDate(date));
  switchView('dashboard');
});

