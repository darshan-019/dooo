/* =====================================================
   STATISTICS
   Completion %, streaks, category hours, totals
   ===================================================== */
/* =========================================================
   STATISTICS
   ========================================================= */
function pctForRange(startKey, endKey){
  let total=0, done=0;
  let k = startKey;
  while(k <= endKey){
    const instances = getInstancesForDate(k);
    total += instances.length;
    done += instances.filter(i=>i.completed).length;
    if(k===endKey) break;
    k = addDays(k,1);
  }
  return {total, done, pct: total? Math.round(done/total*100):0};
}

function isSuccessfulDay(dateKey){
  const inst = getInstancesForDate(dateKey);
  if(!inst.length) return false;
  const completed = inst.filter(i=>i.completed).length;
  return (completed / inst.length) >= 0.7;
}

function computeStreaks(){
  let current = 0;
  let longest = 0;
  let running = 0;

  let earliest = todayKey();
  DB.tasks.forEach(t=>{
    const s = (t.repeat && t.repeat.start) || t.date;
    if(s < earliest) earliest = s;
  });

  let cursor = earliest;
  while(cursor <= todayKey()){
    if(isSuccessfulDay(cursor)){
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
    cursor = addDays(cursor, 1);
  }

  let back = todayKey();
  while(back >= earliest){
    if(!isSuccessfulDay(back)) break;
    current += 1;
    back = addDays(back, -1);
  }

  return {current, longest};
}

function computeHours(){
  const hours = {}; // catId -> minutes
  const seen = new Set();
  DB.tasks.forEach(task=>{
    // walk each date this task/series produced a completed instance
    if(!task.repeat || task.repeat.type==='none'){
      if(task.completed){
        hours[task.category] = (hours[task.category]||0) + Math.max(0,(timeToMinutes(task.end)-timeToMinutes(task.start)));
      }
      return;
    }
    const start = task.repeat.start || task.date;
    const end = task.repeat.end || todayKey();
    let k = start;
    let guard=0;
    while(k <= end && k <= todayKey() && guard<20000){
      guard++;
      if(seriesOccursOnDate(task,k) && !isExcepted(task.seriesId,k)){
        const instId = task.date===k ? task.id : task.id+'__'+k;
        const done = task.date===k ? task.completed : !!DB.completions[instId];
        if(done){
          hours[task.category] = (hours[task.category]||0) + Math.max(0,(timeToMinutes(task.end)-timeToMinutes(task.start)));
        }
      }
      k = addDays(k,1);
    }
  });
  return hours;
}

function renderStats(){
  const today = todayKey();
  const t = pctForRange(today, today);
  document.getElementById('statToday').textContent = t.pct+'%';

  const wkStart = getWeekStart(today);
  const w = pctForRange(wkStart, today);
  document.getElementById('statWeek').textContent = w.pct+'%';

  const mStart = today.slice(0,8)+'01';
  const m = pctForRange(mStart, today);
  document.getElementById('statMonth').textContent = m.pct+'%';

  const yStart = today.slice(0,4)+'-01-01';
  const y = pctForRange(yStart, today);
  document.getElementById('statYear').textContent = y.pct+'%';

  const streaks = computeStreaks();
  document.getElementById('statStreakCurrent').textContent = streaks.current;
  document.getElementById('statStreakLongest').textContent = streaks.longest;

  document.getElementById('statTotalDone').textContent = y.done;
  document.getElementById('statTotalMissed').textContent = (y.total - y.done);
  document.getElementById('statTotalAll').textContent = y.total;

  let daysTracked = 0, k = yStart;
  while(k<=today){ if(getInstancesForDate(k).length) daysTracked++; k=addDays(k,1); }
  document.getElementById('statDaysTracked').textContent = daysTracked;

  const hours = computeHours();
  const hoursGrid = document.getElementById('hoursGrid');
  const relevantCats = ['cat_english','cat_dsa','cat_gym','cat_reading'];
  const catsToShow = DB.categories.filter(c=>relevantCats.includes(c.id) || hours[c.id]);
  hoursGrid.innerHTML = catsToShow.map(c=>{
    const mins = hours[c.id]||0;
    return `<div class="hours-card"><div class="n" style="color:${c.color}">${(mins/60).toFixed(1)}h</div><div class="l">${escapeHtml(c.name)}</div></div>`;
  }).join('') || '<div class="l">No completed tasks yet</div>';
}

