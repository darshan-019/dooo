/* =====================================================
   GLOBAL SEARCH
   Cross-history task search (including recurring instances)
   ===================================================== */
/* =========================================================
   SEARCH
   ========================================================= */
function runSearch(query){
  query = query.trim().toLowerCase();
  if(!query){ switchView('dashboard'); return; }
  const results = [];
  // scan a generous window: all task/series dates present, plus 3 years forward/back from today for recurring
  const seenDates = new Set();
  DB.tasks.forEach(t=>seenDates.add(t.date));

  // simple approach: for each unique task/series, generate matches within [earliest_start, today+2y] but skip if name doesn't match
  DB.tasks.forEach(task=>{
    if(!task.name.toLowerCase().includes(query)) return;
    if(!task.repeat || task.repeat.type==='none'){
      results.push({date:task.date, name:task.name, completed:task.completed, id:task.id});
      return;
    }
    const start = task.repeat.start || task.date;
    const end = task.repeat.end || addDays(todayKey(), 60);
    let k = start;
    let guard=0;
    while(k<=end && guard<3000){
      guard++;
      if(seriesOccursOnDate(task,k) && !isExcepted(task.seriesId,k)){
        const instId = task.date===k ? task.id : task.id+'__'+k;
        const completed = task.date===k ? task.completed : !!DB.completions[instId];
        results.push({date:k, name:task.name, completed, id:instId});
      }
      k = addDays(k,1);
    }
  });

  results.sort((a,b)=> b.date.localeCompare(a.date));
  document.getElementById('searchTitle').textContent = 'Search: "'+query+'"';
  document.getElementById('searchSub').textContent = results.length+' match'+(results.length!==1?'es':'')+' found';
  const list = document.getElementById('searchResults');
  list.innerHTML = '';
  if(!results.length){
    list.innerHTML = `<div class="empty-state"><div class="big">⌕</div><p>No tasks found matching "${escapeHtml(query)}"</p></div>`;
  } else {
    results.slice(0,200).forEach(r=>{
      const row = document.createElement('div');
      row.className = 'hist-row';
      row.innerHTML = `
        <div class="hist-date">${fmtShortDate(r.date)}</div>
        <div style="flex:1; font-size:13.5px; font-weight:600;">${escapeHtml(r.name)}</div>
        <span class="tag ${r.completed?'':''}" style="color:${r.completed?'var(--good)':'var(--text-faint)'}">${r.completed?'✓ Done':'Pending'}</span>
      `;
      row.addEventListener('click', ()=>{ currentDate = r.date; switchView('dashboard'); });
      list.appendChild(row);
    });
  }
  switchView('search');
}
let searchDebounce;
document.getElementById('globalSearch').addEventListener('input', e=>{
  clearTimeout(searchDebounce);
  const q = e.target.value;
  searchDebounce = setTimeout(()=>{ if(q.trim()) runSearch(q); }, 350);
});
document.getElementById('globalSearch').addEventListener('keydown', e=>{
  if(e.key==='Enter') runSearch(e.target.value);
});

