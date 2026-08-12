/* =====================================================
   DELETE TASK
   Delete confirmation + recurring delete scope
   ===================================================== */
/* =========================================================
   DELETE
   ========================================================= */
const deleteModal = document.getElementById('deleteModalOverlay');
function openDeleteConfirm(inst){
  pendingDeleteInstance = inst;
  document.getElementById('deleteTaskName').textContent = inst.name;
  document.getElementById('deleteScopeOptions').style.display = inst.isRecurring ? '' : 'none';
  deleteModal.classList.add('active');
}
document.getElementById('deleteCancelBtn').addEventListener('click', ()=>deleteModal.classList.remove('active'));
deleteModal.addEventListener('click', e=>{ if(e.target===deleteModal) deleteModal.classList.remove('active'); });
document.getElementById('deleteConfirmBtn').addEventListener('click', ()=>{
  const inst = pendingDeleteInstance;
  if(!inst){ deleteModal.classList.remove('active'); return; }
  const task = DB.tasks.find(t=>t.id===inst.sourceTaskId);
  const scope = inst.isRecurring ? document.querySelector('input[name="dscope"]:checked').value : 'this';

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
  toast('Task deleted');
  renderCurrentView();
});

