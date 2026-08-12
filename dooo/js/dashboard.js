/* =====================================================
   DASHBOARD & TIMELINE
   Today/selected-date summary cards + timeline rendering
   ===================================================== */
/* =========================================================
   DASHBOARD
   ========================================================= */
function renderDashboard(){
  const key = currentDate;
  const isToday = key === todayKey();
  document.getElementById('dashEyebrow').textContent = isToday ? 'Today' : (key < todayKey() ? 'Past date' : 'Future date');
  document.getElementById('dashDateTitle').textContent = fmtLongDate(key);

  const instances = getInstancesForDate(key);
  const total = instances.length;
  const completed = instances.filter(i=>i.completed).length;
  const pct = total ? Math.round(completed/total*100) : 0;

  document.getElementById('dashProgressFill').style.width = pct+'%';
  document.getElementById('dashProgressPct').textContent = pct+'%';
  document.getElementById('dashCompleted').textContent = completed;
  document.getElementById('dashCompletedSub').textContent = 'of '+total+' tasks';
  document.getElementById('dashRemaining').textContent = total-completed;

  // current/next task
  let currentTask = null;
  if(isToday){
    const nowMin = timeToMinutes(pad(new Date().getHours())+':'+pad(new Date().getMinutes()));
    currentTask = instances.find(i=>{
      const s = timeToMinutes(i.start), e = timeToMinutes(i.end);
      if(e < s) return nowMin>=s || nowMin<e; // overnight
      return nowMin>=s && nowMin<e;
    }) || instances.find(i=> timeToMinutes(i.start) > nowMin);
  } else {
    currentTask = instances[0];
  }
  if(currentTask){
    document.getElementById('dashCurrentTime').textContent = to12h(currentTask.start)+' – '+to12h(currentTask.end);
    document.getElementById('dashCurrentTitle').textContent = currentTask.name;
    document.getElementById('dashCurrentCat').textContent = catById(currentTask.category).name;
  } else {
    document.getElementById('dashCurrentTime').textContent = '—';
    document.getElementById('dashCurrentTitle').textContent = 'No tasks scheduled';
    document.getElementById('dashCurrentCat').textContent = '';
  }

  renderTimeline(instances, isToday, currentTask);
}

function renderTimeline(instances, isToday, currentTask){
  const container = document.getElementById('timelineContainer');
  container.innerHTML = '';
  if(!instances.length){
    container.innerHTML = `<div class="empty-state">
      <div class="big">◇</div>
      <p>No tasks for this date yet.</p>
      <button class="add-task-btn" onclick="document.getElementById('addTaskBtn').click()">+ Add Task</button>
    </div>`;
    return;
  }
  instances.forEach(inst=>{
    const cat = catById(inst.category);
    const isCurrent = isToday && currentTask && currentTask.instanceId===inst.instanceId && !inst.completed;
    const div = document.createElement('div');
    div.className = 'tl-item' + (inst.completed?' done':'') + (isCurrent?' current':'');
    div.innerHTML = `
      <div class="tl-time">${to12h(inst.start)}<br>${to12h(inst.end)}</div>
      <div class="tl-dot"></div>
      <div class="tl-body">
        <div class="tl-main">
          <div class="tl-check" data-toggle="${inst.instanceId}|${inst.sourceTaskId}|${inst.dateKey}">${inst.completed?'✓':''}</div>
          <div class="tl-info">
            <div class="tl-title">${escapeHtml(inst.name)}</div>
            <div class="tl-meta">
              <span class="tag" style="border-color:${cat.color}55; color:${cat.color}">${escapeHtml(cat.name)}</span>
              ${inst.priority==='high'?'<span class="tag priority-high">High</span>':''}
              ${inst.priority==='medium'?'<span class="tag priority-medium">Medium</span>':''}
              ${inst.isRecurring?'<span class="tag">↻ '+inst.repeat.type+'</span>':''}
            </div>
            ${inst.notes ? `<div class="tl-note">${escapeHtml(inst.notes)}</div>` : ''}
          </div>
        </div>
        <div class="tl-actions">
          <button data-edit="${inst.instanceId}" title="Edit">✏</button>
          <button data-delete="${inst.instanceId}" class="danger" title="Delete">🗑</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('[data-toggle]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const [instanceId, sourceTaskId, dateKey] = el.dataset.toggle.split('|');
      toggleComplete(instanceId, sourceTaskId, dateKey);
      renderDashboard();
    });
  });
  container.querySelectorAll('[data-edit]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const inst = instances.find(i=>i.instanceId===el.dataset.edit);
      openEditTask(inst);
    });
  });
  container.querySelectorAll('[data-delete]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const inst = instances.find(i=>i.instanceId===el.dataset.delete);
      openDeleteConfirm(inst);
    });
  });
}

function escapeHtml(s){
  const d = document.createElement('div');
  d.textContent = s||'';
  return d.innerHTML;
}

