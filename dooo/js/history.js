/* =====================================================
   HISTORY VIEW
   Month-by-month completion log
   ===================================================== */
/* =========================================================
   HISTORY
   ========================================================= */
function renderHistory(){
  const cursor = histMonthCursor;
  document.getElementById('histTitle').textContent = cursor.toLocaleDateString('en-US',{month:'long', year:'numeric'});
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const list = document.getElementById('historyList');
  list.innerHTML = '';
  let any = false;
  for(let d=daysInMonth; d>=1; d--){
    const key = dateKey(new Date(year, month, d));
    if(key > todayKey()) continue; // history = past & today only
    const instances = getInstancesForDate(key);
    if(!instances.length) continue;
    any = true;
    const done = instances.filter(i=>i.completed).length;
    const pct = Math.round(done/instances.length*100);
    const row = document.createElement('div');
    row.className = 'hist-row';
    row.innerHTML = `
      <div class="hist-date">${fmtShortDate(key)}</div>
      <div class="hist-bar-wrap"><div class="hist-bar-fill" style="width:${pct}%"></div></div>
      <div class="hist-pct">${pct}%</div>
    `;
    row.addEventListener('click', ()=>{ currentDate = key; switchView('dashboard'); });
    list.appendChild(row);
  }
  if(!any){
    list.innerHTML = `<div class="empty-state"><div class="big">◷</div><p>No task history for this month.</p></div>`;
  }
}
document.getElementById('histPrevMonth').addEventListener('click', ()=>{ histMonthCursor = new Date(histMonthCursor.getFullYear(), histMonthCursor.getMonth()-1, 1); renderHistory(); });
document.getElementById('histNextMonth').addEventListener('click', ()=>{ histMonthCursor = new Date(histMonthCursor.getFullYear(), histMonthCursor.getMonth()+1, 1); renderHistory(); });

