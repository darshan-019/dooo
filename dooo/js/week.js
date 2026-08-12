/* =====================================================
   WEEK VIEW
   Task x weekday completion matrix
   ===================================================== */
/* =========================================================
   WEEK VIEW
   ========================================================= */
function getWeekStart(key){
  const d = parseKey(key);
  const dow = d.getDay();
  const diff = dow===0 ? -6 : 1-dow; // Monday start
  d.setDate(d.getDate()+diff);
  return dateKey(d);
}
function renderWeek(){
  const start = getWeekStart(weekCursor);
  const days = [];
  for(let i=0;i<7;i++) days.push(addDays(start,i));
  document.getElementById('weekTitle').textContent = fmtShortDate(days[0])+' — '+fmtShortDate(days[6]);

  // gather unique task names across the week (by name+category)
  const rows = {};
  days.forEach((key,di)=>{
    getInstancesForDate(key).forEach(inst=>{
      const rowKey = inst.name+'|'+inst.category;
      if(!rows[rowKey]) rows[rowKey] = {name:inst.name, category:inst.category, cells:Array(7).fill(null)};
      rows[rowKey].cells[di] = inst.completed;
    });
  });

  const table = document.getElementById('weekTable');
  const dowLabels = days.map(k=>parseKey(k).toLocaleDateString('en-US',{weekday:'short'}));
  let html = '<tr><th>Task</th>' + dowLabels.map(l=>`<th>${l}</th>`).join('') + '</tr>';
  const rowsArr = Object.values(rows);
  if(!rowsArr.length){
    html += `<tr><td colspan="8" style="text-align:center; color:var(--text-faint); padding:24px;">No tasks this week</td></tr>`;
  } else {
    rowsArr.forEach(r=>{
      html += `<tr><td>${escapeHtml(r.name)}</td>` + r.cells.map(c=>{
        if(c===null) return `<td><span class="wk-mark dash">–</span></td>`;
        return `<td><span class="wk-mark ${c?'y':'n'}">${c?'✓':'✕'}</span></td>`;
      }).join('') + '</tr>';
    });
  }
  table.innerHTML = html;
}
document.getElementById('weekPrevBtn').addEventListener('click', ()=>{ weekCursor = addDays(getWeekStart(weekCursor), -7); renderWeek(); });
document.getElementById('weekNextBtn').addEventListener('click', ()=>{ weekCursor = addDays(getWeekStart(weekCursor), 7); renderWeek(); });
document.getElementById('weekTodayBtn').addEventListener('click', ()=>{ weekCursor = todayKey(); renderWeek(); });

