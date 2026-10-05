// utils.js
(() => {
  const Utils = {};

  // Mini helpery
  Utils.$ = (s, r = document) => r.querySelector(s);
  Utils.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  Utils.escape = (str = "") => str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  Utils.authorCard = a => `<a href="author.html?id=${encodeURIComponent(a.id)}" class="author-card">
    <div class="author-image-container"><span class="author-initials" aria-hidden="true">${Utils.escape(a.name.split(/\s+/).slice(0, 2).map(part => part[0]).join(""))}</span>
    <img src="${Utils.escape(a.image || '')}" alt="${Utils.escape(a.name)}" class="author-image" loading="lazy" decoding="async" width="640" height="640"></div>
    <h3 class="author-name">${Utils.escape(a.name)}</h3>
    ${a.genre ? `<p class="author-genre">${Utils.escape(a.genre)}</p>` : ''}</a>`;
  Utils.hideBrokenImages = root => root.querySelectorAll('img').forEach(img => {
    const hide = () => { img.hidden = true; };
    img.addEventListener('error', hide, { once: true });
    if (img.complete && !img.naturalWidth) hide();
  });

  // 1) Sdílený layout: header/nav/footer inject
  Utils.injectShared = ({ active = "" } = {}) => {
    const navItems = [
      { href: "all-posts.html", key: "posts", label: "Texty" },
      { href: "all-authors.html", key: "authors", label: "Autoři" },
      { href: "about.html", key: "about", label: "O projektu" },
      { href: "#site-footer", key: "contact", label: "Kontakt" }
    ];
    // One shared header owns the navigation on every page.
    document.getElementById("site-nav")?.remove();
    let header = document.getElementById("site-header");
    if (!header) {
      header = document.createElement("header");
      header.id = "site-header";
      document.body.prepend(header);
    }
    header.className = "topbar";
    header.innerHTML = `
      <div class="topbar__inner">
        <a class="topbar__brand" href="index.html" ${active === "home" ? 'aria-current="page"' : ''}>Tvůrčí psaní</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Otevřít menu">Menu ☰</button>
        <nav id="site-nav" class="topbar__nav" aria-label="Hlavní navigace">
          ${navItems.map(i => `<a href="${i.href}" ${i.key === active ? 'aria-current="page" class="active"' : ''}>${i.label}</a>`).join("")}
        </nav>
      </div>`;
    let footer = document.getElementById("site-footer");
    if (!footer) {
      footer = document.createElement("footer");
      footer.id = "site-footer";
      document.body.appendChild(footer);
    }
    footer.innerHTML = `<div class="container"><p>&copy; ${new Date().getFullYear()} Tvůrčí psaní. <a href="all-authors.html">Autoři</a></p></div>`;
    const btn = header.querySelector(".nav-toggle");
    const nav = header.querySelector("nav");
    const setOpen = open => {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
      nav.classList.toggle("open", open);
    };
    btn.addEventListener("click", () => setOpen(btn.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
    header.addEventListener("keydown", e => {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        btn.focus();
      }
    });
    const desktop = window.matchMedia("(min-width: 701px)");
    desktop.addEventListener("change", () => setOpen(false));
  };

  // 2) Výkon & a11y: imgs lazy + alt + rozměry
  Utils.hardenImages = () => {
    Utils.$$(`img`).forEach(img => {
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.getAttribute("alt")) img.setAttribute("alt", img.dataset.alt || "");
      const setDims = () => {
        if (!img.hasAttribute("width"))  img.setAttribute("width",  img.naturalWidth || 1);
        if (!img.hasAttribute("height")) img.setAttribute("height", img.naturalHeight || 1);
      };
      if (img.complete) setDims(); else img.addEventListener("load", setDims, { once: true });
    });
  };

  // 3) Headings sanity: jeden <h1>, ostatní h2+
  Utils.fixHeadings = () => {
    const h1s = Utils.$$(`main h1`);
    if (h1s.length > 1) {
      h1s.slice(1).forEach(h => { const r = document.createElement("h2"); r.innerHTML = h.innerHTML; h.replaceWith(r); });
    }
  };

  // 4) Data utilita (napojená na data.js)
  Utils.Data = (() => {
    const root = window.DATA || {};
    const posts = Array.isArray(root.posts) ? root.posts : [];
    const authors = Array.isArray(root.authors) ? root.authors : [];
    const byId = arr => Object.fromEntries(arr.filter(x => x && x.id != null).map(x => [String(x.id), x]));
    const authorsById = byId(authors);

    const normalizePost = (p) => {
      if (!p) return null;
      return {
        id: p.id ?? p.slug ?? String(Math.random()).slice(2),
        slug: p.slug ?? (p.title ? p.title.toLowerCase().replace(/\s+/g, "-") : ""),
        title: p.title ?? "Bez názvu",
        date: p.date ? new Date(p.date) : null,
        authorId: p.authorId ?? p.author ?? p.author_id ?? null,
        categories: p.categories ?? p.tags ?? [],
        image: p.image ?? p.thumbnail ?? "",
        alt: p.alt ?? "",
        excerpt: p.excerpt ?? (p.content ? String(p.content).slice(0, 140) + "…" : ""),
        content: p.content ?? p.body ?? ""
      };
    };

    const allPosts = posts.map(normalizePost).filter(Boolean);

    return {
      allPosts: () => allPosts.slice(),
      getPostBySlug: (slug) => allPosts.find(p => p.slug === slug) || null,
      getPosts: ({ authorId = null, category = null, search = "" } = {}) => {
        const q = search.trim().toLowerCase();
        return allPosts.filter(p => {
          if (authorId && String(p.authorId) !== String(authorId)) return false;
          if (category && !(p.categories || []).map(String).includes(String(category))) return false;
          if (q) {
            const hay = `${p.title} ${p.excerpt} ${p.content}`.toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        });
      },
      getAuthors: () => authors.slice(),
      getAuthorById: (id) => authorsById[String(id)] || null,
      listCategories: () => {
        const set = new Set();
        allPosts.forEach(p => (p.categories || []).forEach(c => set.add(String(c))));
        return [...set];
      }
    };
  })();

  // Společný bootstrap pro každou stránku
  Utils.bootstrap = (opts = {}) => {
    Utils.injectShared(opts);
    Utils.hardenImages();
    Utils.fixHeadings();
  };

  window.Utils = Utils;
})();

