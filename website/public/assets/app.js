// All projects and detail pages are rendered at build time; JS only enhances browsing.
const grid = document.querySelector('[data-grid]');
if (grid) {
  document.querySelectorAll('[data-enhanced]').forEach(el => { el.hidden = false; });
  const cards = [...grid.querySelectorAll('[data-project]')];
  const search = document.querySelector('#search');
  const hardware = document.querySelector('#hardware');
  const sort = document.querySelector('#sort');
  const buttons = [...document.querySelectorAll('[data-category-filter]')];
  const empty = document.querySelector('[data-empty]');
  const reset = document.querySelector('[data-reset]');
  const originalEmpty = {
    title: document.querySelector('[data-empty-title]').textContent,
    description: document.querySelector('[data-empty-description]').innerHTML
  };
  let category = 'all';

  function readLocation() {
    const params = new URLSearchParams(location.search);
    search.value = (params.get('q') ?? '').slice(0, 150);
    category = buttons.some(b => b.dataset.categoryFilter === params.get('category')) ? params.get('category') : 'all';
    hardware.value = [...hardware.options].some(o => o.value === params.get('hardware')) ? params.get('hardware') : 'all';
    sort.value = params.get('sort') === 'name' ? 'name' : 'updated';
  }

  function update(save = true) {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const sorted = [...cards].sort((a, b) => sort.value === 'name'
      ? a.dataset.name.localeCompare(b.dataset.name, 'zh-CN')
      : b.dataset.updated.localeCompare(a.dataset.updated) || a.dataset.name.localeCompare(b.dataset.name));
    let count = 0;
    sorted.forEach(card => {
      card.hidden = !((category === 'all' || card.dataset.category === category) &&
        (hardware.value === 'all' || JSON.parse(card.dataset.hardware).includes(hardware.value)) &&
        words.every(word => card.dataset.search.includes(word)));
      if (!card.hidden) count++;
      grid.append(card);
    });
    buttons.forEach(button => {
      const active = button.dataset.categoryFilter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('[data-count]').textContent = String(count).padStart(2, '0');
    document.querySelector('[data-results]').textContent = `显示 ${count} / ${cards.length} 个${document.querySelector('.demo-notice') ? '演示' : '社区'}项目`;
    empty.hidden = count > 0;
    const filtered = !!words.length || category !== 'all' || hardware.value !== 'all';
    document.querySelector('[data-empty-title]').textContent = filtered ? '没有匹配的项目' : originalEmpty.title;
    const description = document.querySelector('[data-empty-description]');
    if (filtered) description.textContent = '请更换关键词或清除筛选。';
    else description.innerHTML = originalEmpty.description;
    reset.hidden = !filtered;
    if (save) {
      const params = new URLSearchParams();
      if (search.value.trim()) params.set('q', search.value.trim());
      if (category !== 'all') params.set('category', category);
      if (hardware.value !== 'all') params.set('hardware', hardware.value);
      if (sort.value !== 'updated') params.set('sort', sort.value);
      const query = params.toString();
      history.replaceState(null, '', location.pathname + (query ? `?${query}` : '') + location.hash);
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.categoryFilter; update(); }));
  search.addEventListener('input', () => update());
  hardware.addEventListener('change', () => update());
  sort.addEventListener('change', () => update());
  reset.addEventListener('click', () => { search.value = ''; category = 'all'; hardware.value = 'all'; sort.value = 'updated'; update(); search.focus(); });
  addEventListener('popstate', () => { readLocation(); update(false); });
  addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable]')) {
      event.preventDefault(); search.focus();
    }
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
      const range = document.createRange();
      range.selectNodeContents(template);
      const selection = getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      label.textContent = '已选中，请手动复制';
    }
  });
});
