// Static pages work without JS; this only adds search and category filters.
const grid = document.querySelector('[data-grid]');
if (grid) {
  document.querySelectorAll('[data-enhanced]').forEach(el => { el.hidden = false; });
  const cards = [...grid.querySelectorAll('[data-project]')];
  const search = document.querySelector('#search');
  const buttons = [...document.querySelectorAll('[data-category-filter]')];
  const empty = document.querySelector('[data-empty]');
  const reset = document.querySelector('[data-reset]');
  const original = { title: document.querySelector('[data-empty-title]').textContent, description: document.querySelector('[data-empty-description]').textContent };
  let category = 'all';
  function readLocation() {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') ?? '').slice(0, 150);
    category = buttons.some(b => b.dataset.categoryFilter === params.get('category')) ? params.get('category') : 'all';
  }
  function update(save = true) {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !((category === 'all' || card.dataset.category === category) && words.every(word => card.dataset.search.includes(word)));
      if (!card.hidden) count++;
    });
    buttons.forEach(button => {
      const active = button.dataset.categoryFilter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('[data-count]').textContent = String(count).padStart(2, '0');
    document.querySelector('[data-results]').textContent = `显示 ${count} / ${cards.length} 个作品`;
    empty.hidden = count > 0;
    const filtered = !!words.length || category !== 'all';
    document.querySelector('[data-empty-title]').textContent = filtered ? '没有匹配的作品' : original.title;
    document.querySelector('[data-empty-description]').textContent = filtered ? '请更换关键词或清除筛选。' : original.description;
    reset.hidden = !filtered;
    if (save) {
      const params = new URLSearchParams();
      if (search.value.trim()) params.set('q', search.value.trim());
      if (category !== 'all') params.set('category', category);
      history.replaceState(null, '', location.pathname + (params.size ? '?' + params : '') + location.hash);
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.categoryFilter; update(); }));
  search.addEventListener('input', () => update());
  reset.addEventListener('click', () => { search.value = ''; category = 'all'; update(); search.focus(); });
  addEventListener('popstate', () => { readLocation(); update(false); });
  addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable]')) { event.preventDefault(); search.focus(); }
  });
  readLocation(); update(false);
}

document.querySelectorAll('[data-copy]').forEach(button => {
  const label = button.querySelector('span');
  const original = label.textContent;
  let resetTimer;
  button.addEventListener('click', async () => {
    const template = document.getElementById(button.dataset.copy);
    if (!template) return;
    try {
      await navigator.clipboard.writeText(template.textContent);
      clearTimeout(resetTimer);
      label.textContent = '已复制';
      resetTimer = setTimeout(() => { label.textContent = original; }, 2200);
    } catch {
      const disclosure = template.closest('details');
      if (disclosure) disclosure.open = true;
      const range = document.createRange();
      range.selectNodeContents(template);
      const selection = getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      label.textContent = '已选中，请手动复制';
    }
  });
});
