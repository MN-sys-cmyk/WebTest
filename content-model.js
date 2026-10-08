/* Shared rules used by the editor and the publication build. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ContentModel = factory();
})(typeof window === 'undefined' ? globalThis : window, function () {
  const idPattern = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/;
  const imagePattern = /^(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpe?g|webp|gif)$/i;
  const copy = value => JSON.parse(JSON.stringify(value));
  function validate(data) {
    const errors = [];
    if (!data || data.version !== 1 || !Array.isArray(data.authors) || !Array.isArray(data.posts) || !Array.isArray(data.tags)) return ['Neplatný formát obsahu.'];
    const authorIds = new Set(), postIds = new Set();
    const text = (value, label, required = false, limit = 200000) => {
      if (typeof value !== 'string' || value.length > limit || (required && !value.trim())) errors.push(`${label}: vyplňte platný text (max. ${limit} znaků).`);
    };
    const image = (value, label) => { if (typeof value !== 'string' || (value && (!imagePattern.test(value) || value.includes('..')))) errors.push(`${label}: neplatná cesta k obrázku.`); };
    const uniqueId = (id, set, label) => { if (typeof id !== 'string' || !idPattern.test(id) || set.has(id)) errors.push(`${label}: neplatný nebo duplicitní identifikátor.`); set.add(id); };
    for (const a of data.authors) {
      if (!a || typeof a !== 'object') { errors.push('Neplatný autor.'); continue; }
      uniqueId(a.id, authorIds, 'Autor');
      text(a.name, 'Jméno autora', true, 160); text(a.bio, 'Medailonek'); text(a.genre, 'Žánry autora', false, 300); image(a.image, 'Fotografie autora');
      if (typeof a.published !== 'boolean') errors.push('Autor musí mít stav zveřejnění.');
    }
    if (data.tags.some(t => typeof t !== 'string' || !t.trim() || t.length > 80) || new Set(data.tags).size !== data.tags.length) errors.push('Štítky musí být neprázdné, jedinečné názvy do 80 znaků.');
    for (const p of data.posts) {
      if (!p || typeof p !== 'object') { errors.push('Neplatný text.'); continue; }
      uniqueId(p.id, postIds, 'Text');
      text(p.title, 'Název textu', true, 250); text(p.excerpt, 'Anotace', p.status === 'published', 1500); text(p.authorWord, 'Slovo autora', false, 10000); text(p.content, 'Celý text', p.status === 'published'); text(p.alt, 'Popis obrázku', false, 300); image(p.image, 'Obrázek textu');
      if (!['draft', 'published'].includes(p.status)) errors.push('Neplatný stav textu.');
      if (!authorIds.has(p.authorId)) errors.push(`Text „${p.title}“ nemá existujícího autora. Nejdříve převeďte nebo odeberte jeho texty.`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date) || !Number.isFinite(Date.parse(p.date)) || new Date(p.date).toISOString().slice(0, 10) !== p.date) errors.push(`Text „${p.title}“ má neplatné datum.`);
      if (!Array.isArray(p.categories) || !p.categories.length || p.categories.some(t => typeof t !== 'string' || !t.trim() || t.length > 80)) errors.push(`Text „${p.title}“ musí mít žánr.`);
      if (!Array.isArray(p.tags) || p.tags.some(t => !data.tags.includes(t))) errors.push(`Text „${p.title}“ obsahuje neexistující štítek.`);
    }
    return errors;
  }
  function publicData(data) {
    const errors = validate(data);
    if (errors.length) throw new Error(errors.join('\n'));
    const authors = data.authors.filter(a => a.published);
    const ids = new Set(authors.map(a => a.id));
    const posts = data.posts.filter(p => p.status === 'published' && ids.has(p.authorId)).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
    return copy({authors, posts, tags: data.tags.filter(t => posts.some(p => p.tags.includes(t)))});
  }
  function removeAuthor(data, id) {
    if (data.posts.some(p => p.authorId === id)) throw new Error('Autor má texty. Nejdříve je převeďte k jinému autorovi nebo odstraňte (včetně konceptů).');
    data.authors = data.authors.filter(a => a.id !== id);
  }
  function renameTag(data, oldName, newName) {
    newName = newName.trim();
    if (!newName || newName.length > 80 || (newName !== oldName && data.tags.includes(newName))) throw new Error('Název štítku musí být jedinečný a mít 1–80 znaků.');
    data.tags = data.tags.map(t => t === oldName ? newName : t);
    data.posts.forEach(p => { p.tags = p.tags.map(t => t === oldName ? newName : t); });
  }
  return {validate, publicData, removeAuthor, renameTag, copy};
});
