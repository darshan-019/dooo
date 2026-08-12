/* =====================================================
   CATEGORIES
   Category CRUD + color picker
   ===================================================== */
/* =========================================================
   CATEGORIES
   ========================================================= */
function renderCategories(){
  const list = document.getElementById('catList');
  list.innerHTML = '';
  DB.categories.forEach(c=>{
    const count = DB.tasks.filter(t=>t.category===c.id).length;
    const row = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `
      <span class="cat-dot" style="background:${c.color}"></span>
      <span class="name">${escapeHtml(c.name)}</span>
      <span class="cnt">${count} task${count!==1?'s':''}</span>
      <button class="btn-sm" data-editc="${c.id}">Edit</button>
      <button class="btn-sm" data-delc="${c.id}">Delete</button>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('[data-editc]').forEach(b=>b.addEventListener('click', ()=>openCatModal(b.dataset.editc)));
  list.querySelectorAll('[data-delc]').forEach(b=>b.addEventListener('click', ()=>{
    if(DB.tasks.some(t=>t.category===b.dataset.delc)){
      if(!confirm('Some tasks use this category. Delete anyway? They will keep the category id but it will no longer appear in the list.')) return;
    }
    DB.categories = DB.categories.filter(c=>c.id!==b.dataset.delc);
    save(); renderCategories(); toast('Category deleted');
  }));
}

const catModal = document.getElementById('catModalOverlay');
let editingCatId = null;
function buildColorPicker(selected){
  const wrap = document.getElementById('catColorPicker');
  wrap.innerHTML = CATEGORY_COLORS.map(col=>`<button type="button" class="radio-chip ${col===selected?'selected':''}" data-color="${col}" style="background:${col}22; border-color:${col}66; color:${col}">●</button>`).join('');
  wrap.querySelectorAll('button').forEach(b=>b.addEventListener('click', ()=>{
    wrap.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
  }));
}
document.getElementById('newCatBtn').addEventListener('click', ()=>openCatModal(null));
function openCatModal(id){
  editingCatId = id;
  const cat = id ? DB.categories.find(c=>c.id===id) : null;
  document.getElementById('catModalTitle').textContent = id ? 'Edit Category' : 'New Category';
  document.getElementById('catName').value = cat ? cat.name : '';
  buildColorPicker(cat ? cat.color : CATEGORY_COLORS[0]);
  catModal.classList.add('active');
}
document.getElementById('catCancelBtn').addEventListener('click', ()=>catModal.classList.remove('active'));
catModal.addEventListener('click', e=>{ if(e.target===catModal) catModal.classList.remove('active'); });
document.getElementById('catSaveBtn').addEventListener('click', ()=>{
  const name = document.getElementById('catName').value.trim();
  if(!name){ toast('Enter a category name'); return; }
  const colorBtn = document.querySelector('#catColorPicker .radio-chip.selected');
  const color = colorBtn ? colorBtn.dataset.color : CATEGORY_COLORS[0];
  if(editingCatId){
    const cat = DB.categories.find(c=>c.id===editingCatId);
    cat.name = name; cat.color = color;
  } else {
    DB.categories.push({id:uid('cat'), name, color});
  }
  save();
  catModal.classList.remove('active');
  renderCategories();
  toast('Category saved');
});

