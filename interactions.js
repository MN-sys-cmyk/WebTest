// One native modal shared by all static and dynamically rendered author-word buttons.
(() => {
  let dialog;
  let trigger;
  let previousOverflow;
  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'word-dialog';
    dialog.setAttribute('aria-labelledby', 'word-dialog-title');
    dialog.innerHTML = '<button type="button" class="word-dialog__close" aria-label="Zavřít dialog" autofocus>×</button><h2 id="word-dialog-title">Slovo autora</h2><div class="word-dialog__body"></div>';
    document.body.appendChild(dialog);
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {
      const r = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus();
    });
    return dialog;
  }
  document.addEventListener('click', e => {
    const button = e.target.closest('button.author-word-toggle');
    if (!button) return;
    const box = button.closest('.author-word-box');
    const source = box?.querySelector('.authorWordText, #authorWord');
    const modal = ensureDialog();
    if (modal.open) return;
    trigger = button;
    modal.querySelector('.word-dialog__body').textContent = source?.textContent.trim() || 'Autor zatím nic nedodal.';
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
  });
})();
