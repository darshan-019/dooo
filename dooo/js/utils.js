/* =====================================================
   SHARED UI HELPERS
   Toasts, view switching, category lookup, mobile sidebar, clock
   ===================================================== */
/* =========================================================
   UI HELPERS
   ========================================================= */
function toast(msg, undoAction){
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = 'toast';

  if(undoAction){
    el.innerHTML = `
      <div class="toast-content">
        <span>${escapeHtml(msg)}</span>
        <button type="button" class="toast-undo">Undo</button>
      </div>
    `;
    const btn = el.querySelector('.toast-undo');
    btn.addEventListener('click', ()=>{
      undoAction();
      el.remove();
    });
  } else {
    el.textContent = msg;
  }

  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(),300); }, 2600);
}

function catById(id){ return DB.categories.find(c=>c.id===id) || {name:'Other', color:'#9198a8'}; }

function switchView(view){
  currentView = view;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  const el = document.getElementById('view-'+view);
  if(el) el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.view===view));
  document.querySelectorAll('.bottom-nav button').forEach(n=>n.classList.toggle('active', n.dataset.view===view));
  closeMobileSidebar();
  renderCurrentView();
}

function renderCurrentView(){
  if(currentView==='dashboard') renderDashboard();
  else if(currentView==='calendar') renderCalendar();
  else if(currentView==='week') renderWeek();
  else if(currentView==='routines') renderRoutines();
  else if(currentView==='history') renderHistory();
  else if(currentView==='stats') renderStats();
  else if(currentView==='categories') renderCategories();
}

function closeMobileSidebar(){
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobileOverlay').classList.remove('active');
}



/* =========================================================
   CLOCK
   ========================================================= */
function updateClock(){
  const now = new Date();
  document.getElementById('clockTime').textContent = now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  document.getElementById('clockDate').textContent = now.toLocaleDateString('en-US',{weekday:'short', day:'numeric', month:'short'});
}
updateClock();
setInterval(updateClock, 15000);
setInterval(()=>{ if(currentView==='dashboard') renderDashboard(); }, 60000);

