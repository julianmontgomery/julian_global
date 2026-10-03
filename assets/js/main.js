/* ==========================================================
   Contact settings. Change these three lines to update every
   email and WhatsApp link on the site.
   ========================================================== */
const CONTACT_EMAIL = "hello@julianglobal.com.br";
const WHATSAPP_NUMBER = "5541998946742";
const SITE_URL = "https://julianglobal.com.br/";

(function () {
  "use strict";

  const I18N = window.I18N || {};
  const LANGS = ["pt", "en", "es"];
  const HTML_LANG = { pt: "pt-BR", en: "en", es: "es" };
  const FLAG = { pt: "#flag-br", en: "#flag-us", es: "#flag-es" };
  const THEME_COLOR = { light: "#F4EFE4", dark: "#0D1524" };
  const root = document.documentElement;
  let lang = "pt";

  /* Storage can be unavailable (private windows, previews). Never depend on it. */
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  const t = (key) => {
    const dict = I18N[lang] || {};
    return dict[key] != null ? dict[key] : (I18N.en && I18N.en[key] != null ? I18N.en[key] : "");
  };

  /* Language precedence: ?lang= in the URL > saved choice > browser language > English */
  function detectLang() {
    try {
      const q = new URLSearchParams(window.location.search).get("lang");
      if (q && LANGS.includes(q.toLowerCase())) return q.toLowerCase();
    } catch (e) { /* ignore */ }
    const saved = store.get("jm-lang");
    if (saved && LANGS.includes(saved)) return saved;
    const nav = String((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
    if (nav.startsWith("pt")) return "pt";
    if (nav.startsWith("es")) return "es";
    return "en";
  }

  /* ---------- Links ---------- */
  function mailtoHref(type) {
    const subject = t("mail." + type + ".s") + " · Julian Montgomery";
    const body = t("mail." + type + ".b");
    return "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function waHref() {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(t("wa.text"));
  }
  function waDisplay() {
    const n = WHATSAPP_NUMBER;
    return n.length === 13 && n.startsWith("55")
      ? "+55 (" + n.slice(2, 4) + ") " + n.slice(4, 9) + "-" + n.slice(9)
      : "+" + n;
  }
  function updateLinks() {
    document.querySelectorAll("[data-mail]").forEach((a) => { a.href = mailtoHref(a.dataset.mail); });
    document.querySelectorAll("[data-wa]").forEach((a) => {
      a.href = waHref();
      if (a.closest(".contact-list")) a.textContent = waDisplay();
    });
    document.querySelectorAll("[data-email]").forEach((a) => {
      a.href = "mailto:" + CONTACT_EMAIL;
      a.textContent = CONTACT_EMAIL;
    });
  }

  /* ---------- Theme ---------- */
  function currentTheme() {
    const set = root.getAttribute("data-theme");
    if (set === "dark" || set === "light") return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function updateThemeUI() {
    const btn = document.getElementById("theme-btn");
    if (!btn) return;
    const isDark = currentTheme() === "dark";
    const key = isDark ? "ui.theme.toLight" : "ui.theme.toDark";
    btn.setAttribute("aria-label", t(key));
    btn.setAttribute("data-i18n-attr", "aria-label:" + key);
    btn.setAttribute("aria-pressed", String(isDark));
  }
  function setTheme(next) {
    root.setAttribute("data-theme", next);
    store.set("jm-theme", next);
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", THEME_COLOR[next]));
    updateThemeUI();
  }

  /* ---------- Language ---------- */
  function applyLang(next) {
    lang = LANGS.includes(next) ? next : "en";
    root.lang = HTML_LANG[lang];
    root.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    document.title = t("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));

    /* Testimonials: quote language follows the page; originals stay pt-BR */
    document.querySelectorAll(".q-text").forEach((el) => el.setAttribute("lang", HTML_LANG[lang]));
    document.querySelectorAll(".q-toggle").forEach((b) => {
      const orig = document.getElementById(b.getAttribute("aria-controls"));
      if (orig) orig.hidden = true;
      b.setAttribute("aria-expanded", "false");
      b.textContent = t("ui.show");
    });

    /* Switcher state */
    const flag = document.getElementById("lang-flag");
    if (flag) flag.setAttribute("href", FLAG[lang]);
    const code = document.getElementById("lang-code");
    if (code) code.textContent = lang.toUpperCase();
    document.querySelectorAll("[data-set-lang]").forEach((b) => {
      b.setAttribute("aria-current", b.dataset.setLang === lang ? "true" : "false");
    });

    updateLinks();
    updateThemeUI();
  }

  function initLangMenu() {
    const btn = document.getElementById("lang-btn");
    const menu = document.getElementById("lang-menu");
    if (!btn || !menu) return;
    const items = () => Array.from(menu.querySelectorAll("button"));
    const open = (focusCurrent) => {
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      if (focusCurrent) (menu.querySelector('[aria-current="true"]') || items()[0]).focus();
    };
    const close = (returnFocus) => {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (returnFocus) btn.focus();
    };
    btn.addEventListener("click", () => (menu.hidden ? open(true) : close(false)));
    menu.addEventListener("click", (e) => {
      const b = e.target.closest("[data-set-lang]");
      if (!b) return;
      store.set("jm-lang", b.dataset.setLang);
      applyLang(b.dataset.setLang);
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("lang")) {
          url.searchParams.set("lang", lang);
          window.history.replaceState(null, "", url);
        }
      } catch (err) { /* ignore */ }
      close(true);
    });
    menu.addEventListener("keydown", (e) => {
      const list = items();
      const i = list.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
      if (e.key === "Escape") { e.preventDefault(); close(true); }
    });
    document.addEventListener("click", (e) => {
      if (!menu.hidden && !e.target.closest(".lang")) close(false);
    });
  }

  function initMenu() {
    const btn = document.getElementById("menu-btn");
    const nav = document.getElementById("nav-links");
    if (!btn || !nav) return;
    const set = (open) => {
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", () => set(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { set(false); btn.focus(); }
    });
  }

  function initQuotes() {
    document.querySelectorAll(".q-toggle").forEach((b) => {
      b.addEventListener("click", () => {
        const orig = document.getElementById(b.getAttribute("aria-controls"));
        if (!orig) return;
        const show = orig.hidden;
        orig.hidden = !show;
        b.setAttribute("aria-expanded", String(show));
        b.textContent = t(show ? "ui.hide" : "ui.show");
      });
    });
  }

  function initCopy() {
    const btn = document.getElementById("copy-email");
    if (!btn) return;
    const label = btn.querySelector("span");
    const done = () => {
      if (label) label.textContent = t("ui.copied");
      setTimeout(() => { if (label) label.textContent = t("ui.copy"); }, 1800);
    };
    const selectText = () => {
      const a = document.querySelector(".contact-list [data-email]");
      if (!a) return;
      const r = document.createRange();
      r.selectNodeContents(a);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    };
    btn.addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CONTACT_EMAIL).then(done, selectText);
      } else {
        selectText();
      }
    });
  }

  /* Photo: until assets/julian.jpg exists, show the styled monogram placeholder */
  function initPortrait() {
    const img = document.querySelector(".portrait img");
    if (!img) return;
    const fail = () => { img.hidden = true; };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  }

  /* ---------- Boot ---------- */
  applyLang(detectLang());
  initLangMenu();
  initMenu();
  initQuotes();
  initCopy();
  initPortrait();

  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) themeBtn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => updateThemeUI();
    if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Keep the canonical link in step with SITE_URL (also update index.html, sitemap.xml and robots.txt if the domain changes). */
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", SITE_URL);
})();
