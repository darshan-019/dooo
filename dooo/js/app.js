/* =====================================================
   APP BOOTSTRAP
   Nav wiring, date controls, mobile menu, initial render
   Must be loaded LAST — after every other js/*.js file
   ===================================================== */
/* =========================================================
   NAVIGATION
   ========================================================= */
document.querySelectorAll('.nav-item[data-view], .bottom-nav button[data-view]').forEach(btn=>{
  btn.addEventListener('click', ()=> switchView(btn.dataset.view));
});
document.getElementById('prevDayBtn').addEventListener('click', ()=>{ currentDate = addDays(currentDate,-1); renderDashboard(); });
document.getElementById('nextDayBtn').addEventListener('click', ()=>{ currentDate = addDays(currentDate,1); renderDashboard(); });
document.getElementById('todayBtn').addEventListener('click', ()=>{ currentDate = todayKey(); renderDashboard(); });

document.getElementById('hamburgerBtn').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.add('mobile-open');
  document.getElementById('mobileOverlay').classList.add('active');
});
document.getElementById('mobileOverlay').addEventListener('click', closeMobileSidebar);



/* =========================================================
   INIT
   ========================================================= */
renderDashboard();

