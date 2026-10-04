// Glossary popovers: a term button opens a small definition panel under it.
interface Term { id: string; term: string; definition: string; analogy?: string }

const data = document.getElementById('glossary-data');
const terms: Record<string, Term> = data ? JSON.parse(data.textContent ?? '{}') : {};
let open: { button: HTMLButtonElement; panel: HTMLElement } | null = null;

function close(returnFocus = true) {
  if (!open) return;
  open.panel.remove();
  open.button.setAttribute('aria-expanded', 'false');
  if (returnFocus) open.button.focus();
  open = null;
}

function show(button: HTMLButtonElement) {
  const t = terms[button.dataset.term ?? ''];
  if (!t) return;
  close(false);
  const panel = document.createElement('div');
  panel.className = 'term-pop';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', `term-pop-${t.id}`);
  panel.innerHTML = `
    <p class="term-pop__name" id="term-pop-${t.id}"></p>
    <p class="term-pop__def"></p>
    ${t.analogy ? '<p class="term-pop__analogy"></p>' : ''}
    <div class="term-pop__foot"><a href="/glossary#${t.id}">Open in glossary</a><button type="button" class="term-pop__close">Close</button></div>`;
  panel.querySelector('.term-pop__name')!.textContent = t.term;
  panel.querySelector('.term-pop__def')!.textContent = t.definition;
  if (t.analogy) panel.querySelector('.term-pop__analogy')!.textContent = `Think of it as: ${t.analogy}`;
  panel.querySelector('.term-pop__close')!.addEventListener('click', () => close());
  document.body.append(panel);
  const r = button.getBoundingClientRect();
  const w = panel.offsetWidth;
  const left = Math.min(Math.max(8, r.left + window.scrollX), window.scrollX + document.documentElement.clientWidth - w - 8);
  panel.style.left = `${left}px`;
  panel.style.top = `${r.bottom + window.scrollY + 8}px`;
  button.setAttribute('aria-expanded', 'true');
  open = { button, panel };
  panel.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('button.term');
  if (button) {
    if (open?.button === button) close();
    else show(button);
    return;
  }
  if (open && !open.panel.contains(target)) close(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && open) {
    e.preventDefault();
    close();
  }
});
