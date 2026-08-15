/* =====================================================
   DELETE TASK
   Delete confirmation + recurring delete scope
   ===================================================== */
/* =========================================================
   DELETE
   ========================================================= */
const deleteModal = document.getElementById('deleteModalOverlay');
const deleteDayModal = document.getElementById('deleteDayModalOverlay');
let pendingDayDeleteKey = null;
let lastDeletedSnapshot = null;

function undoLastDelete(){
  if(!lastDeletedSnapshot) return;
  DB = JSON.parse(JSON.stringify(lastDeletedSnapshot));
  lastDeletedSnapshot = null;
  save();
  renderCurrentView();
  toast('Deletion undone');
}

function openDeleteConfirm(inst){
  pendingDeleteInstance = inst;
  document.getElementById('deleteTaskName').textContent = inst.name;
  document.getElementById('deleteScopeOptions').style.display = inst.isRecurring ? '' : 'none';
  deleteModal.classList.add('active');
}

function openDayDeleteConfirm(dateKey){
  pendingDayDeleteKey = dateKey;
  document.getElementById('deleteDayLabel').textContent = fmtLongDate(dateKey);
  deleteDayModal.classList.add('active');
}

document.getElementById('deleteCancelBtn').addEventListener('click', ()=>deleteModal.classList.remove('active'));
document.getElementById('deleteDayCancelBtn').addEventListener('click', ()=>deleteDayModal.classList.remove('active'));
deleteModal.addEventListener('click', e=>{ if(e.target===deleteModal) deleteModal.classList.remove('active'); });
deleteDayModal.addEventListener('click', e=>{ if(e.target===deleteDayModal) deleteDayModal.classList.remove('active'); });

function deleteAllTasksForDate(dateKey){
  const affected = DB.tasks.filter(task => {
    if(task.date === dateKey) return true;
    if(task.repeat && task.repeat.type !== 'none' && task.seriesId && seriesOccursOnDate(task, dateKey) && !isExcepted(task.seriesId, dateKey)) return true;
    return false;
  });

  if(!affected.length){
    toast('No tasks on this day');
    return;
  }

  lastDeletedSnapshot = JSON.parse(JSON.stringify(DB));

  affected.forEach(task => {
    if(task.date === dateKey){
      DB.tasks = DB.tasks.filter(t => t.id !== task.id);
      return;
    }
    if(task.seriesId){
      if(!DB.exceptions[task.seriesId]) DB.exceptions[task.seriesId] = {};
      DB.exceptions[task.seriesId][dateKey] = 'deleted';
    }
  });

  save();
  toast('All tasks for this day deleted', undoLastDelete);
  renderCurrentView();
}

document.getElementById('deleteDayBtn').addEventListener('click', ()=>{
  openDayDeleteConfirm(currentDate);
});

document.getElementById('deleteDayConfirmBtn').addEventListener('click', ()=>{
  if(!pendingDayDeleteKey) return;
  deleteAllTasksForDate(pendingDayDeleteKey);
  deleteDayModal.classList.remove('active');
});

document.getElementById('deleteConfirmBtn').addEventListener('click', ()=>{
  const inst = pendingDeleteInstance;
  if(!inst){ deleteModal.classList.remove('active'); return; }
  const task = DB.tasks.find(t=>t.id===inst.sourceTaskId);
  const scope = inst.isRecurring ? document.querySelector('input[name="dscope"]:checked').value : 'this';

  lastDeletedSnapshot = JSON.parse(JSON.stringify(DB));

  if(!inst.isRecurring){
    DB.tasks = DB.tasks.filter(t=>t.id!==task.id);
  } else if(scope==='this'){
    if(!DB.exceptions[task.seriesId]) DB.exceptions[task.seriesId] = {};
    DB.exceptions[task.seriesId][inst.dateKey] = 'deleted';
  } else if(scope==='all'){
    DB.tasks = DB.tasks.filter(t=>t.id!==task.id);
    delete DB.exceptions[task.seriesId];
  } else if(scope==='future'){
    const dayBefore = addDays(inst.dateKey, -1);
    if(task.repeat.start >= inst.dateKey){
      DB.tasks = DB.tasks.filter(t=>t.id!==task.id);
    } else {
      task.repeat.end = dayBefore;
    }
  }
  save();
  deleteModal.classList.remove('active');
  toast('Task deleted', undoLastDelete);
  renderCurrentView();
});

