// utils.js
(() => {
  const Utils = {};

  // Mini helpery
  Utils.$ = (s, r = document) => r.querySelector(s);
  Utils.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  Utils.escape = (str = "") => str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  // 1) Sdílený layout: header/nav/footer inject
  Utils.injectShared = ({ active = "" } = {}) => {
    const headerHtml = `
      <div class="container">
        <a class="logo" href="index.html" aria-label="Domů">WebTest</a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">☰</button>
      </div>
    `;

    const navItems = [
      { href: "index.html", key: "home", label: "Domů" },
      { href: "all-posts.html", key: "posts", label: "Články" },
      { href: "all-authors.html", key: "authors", label: "Autoři" }
    ];

    const navHtml = `
      <ul class="nav-list">
        ${navItems.map(i => `
          <li>
            <a href="${i.href}" ${i.key === active ? 'aria-current="page" class="is-active"' : ""}>
              ${Utils.escape(i.label)}
            </a>
          </li>`).join("")}
      </ul>
    `;

    const footerHtml = `
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} WebTest. <a href="all-authors.html">Autoři</a></p>
      </div>
    `;

    // Umístění (vytvoří, pokud chybí)
    const ensure = (id, tag) => {
      let el = Utils.$(`#${id}`);
      if (!el) {
        el = document.createElement(tag);
        el.id = id;
        document.body.insertAdjacentElement(tag === "header" ? "afterbegin" : "beforeend", el);
      }
      return el;
    };

    ensure("site-header", "header").innerHTML = headerHtml;
    ensure("site-nav", "nav").innerHTML = navHtml;
    ensure("site-footer", "footer").innerHTML = footerHtml;

    // Mobilní toggle
    const btn = Utils.$(".nav-toggle");
    const nav = Utils.$("#site-nav");
    if (btn && nav) {
      btn.addEventListener("click", () => {
        const exp = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!exp));
        nav.classList.toggle("open");
      });
    }
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
