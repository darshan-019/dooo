/* =====================================================
   CALENDAR VIEW
   Month grid with per-day completion bars
   ===================================================== */
/* =========================================================
   CALENDAR VIEW
   ========================================================= */
function dayCompletionPct(key){
  const instances = getInstancesForDate(key);
  if(!instances.length) return null;
  const done = instances.filter(i=>i.completed).length;
  return Math.round(done/instances.length*100);
}

function renderCalendar(){
  const cursor = calMonthCursor;
  document.getElementById('calTitle').textContent = cursor.toLocaleDateString('en-US',{month:'long', year:'numeric'});
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d=>{
    const el = document.createElement('div'); el.className='cal-dow'; el.textContent=d; grid.appendChild(el);
  });
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for(let i=startOffset-1;i>=0;i--) cells.push({day:daysInPrevMonth-i, other:true, month:month-1});
  for(let d=1; d<=daysInMonth; d++) cells.push({day:d, other:false, month});
  while(cells.length % 7 !== 0) cells.push({day:cells.length, other:true, month:month+1});

  cells.forEach(c=>{
    const realDate = new Date(year, c.month, c.day);
    const key = dateKey(realDate);
    const pct = dayCompletionPct(key);
    const div = document.createElement('div');
    div.className = 'cal-cell' + (c.other?' other-month':'') + (key===todayKey()?' today':'') + (key===currentDate?' selected':'');
    div.innerHTML = `
      <div class="cal-daynum">${c.day}</div>
      ${pct!==null ? `<div class="cal-bar"><div class="cal-bar-fill" style="width:${pct}%"></div></div>` : '<div></div>'}
    `;
    div.addEventListener('click', ()=>{
      currentDate = key;
      switchView('dashboard');
    });
    grid.appendChild(div);
  });
}
document.getElementById('calPrevMonth').addEventListener('click', ()=>{ calMonthCursor = new Date(calMonthCursor.getFullYear(), calMonthCursor.getMonth()-1, 1); renderCalendar(); });
document.getElementById('calNextMonth').addEventListener('click', ()=>{ calMonthCursor = new Date(calMonthCursor.getFullYear(), calMonthCursor.getMonth()+1, 1); renderCalendar(); });
document.getElementById('calTodayBtn').addEventListener('click', ()=>{ calMonthCursor = new Date(); renderCalendar(); });

