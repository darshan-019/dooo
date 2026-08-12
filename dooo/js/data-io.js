/* =====================================================
   IMPORT / EXPORT / RESET
   JSON backup, restore, and full data wipe
   ===================================================== */
/* =========================================================
   IMPORT / EXPORT
   ========================================================= */
function exportData(){
  const blob = new Blob([JSON.stringify(DB, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ledger-backup-'+todayKey()+'.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Data exported');
}
document.getElementById('exportBtn').addEventListener('click', exportData);
document.getElementById('settingsExportBtn').addEventListener('click', exportData);

function triggerImport(){ document.getElementById('importFile').click(); }
document.getElementById('importBtn').addEventListener('click', triggerImport);
document.getElementById('settingsImportBtn').addEventListener('click', triggerImport);
document.getElementById('importFile').addEventListener('change', function(e){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(evt){
    try{
      const parsed = JSON.parse(evt.target.result);
      if(!parsed.tasks || !parsed.categories) throw new Error('Invalid file format');
      DB = parsed;
      DB.exceptions = DB.exceptions || {};
      DB.completions = DB.completions || {};
      save();
      toast('Data imported successfully');
      renderCurrentView();
    }catch(err){
      toast('Import failed: invalid file');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

document.getElementById('resetAllBtn').addEventListener('click', ()=>{
  if(confirm('This will permanently erase all tasks, routines, and history. Continue?')){
    if(confirm('Are you absolutely sure? This cannot be undone.')){
      DB = seedData();
      save();
      currentDate = todayKey();
      toast('All data erased and reset');
      switchView('dashboard');
    }
  }
});

