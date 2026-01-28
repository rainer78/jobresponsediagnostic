(function () {
  "use strict";

  // ----- Config -----
  const DEFAULT_BRIEF = "filtering-failure";

  // ----- Helpers -----
  function qs(id) {
    return document.getElementById(id);
  }

  function getBriefKey() {
    const params = new URLSearchParams(window.location.search);
    const raw = (params.get("brief") || DEFAULT_BRIEF).trim();
    // basic sanitization: allow letters, numbers, dash only
    const safe = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    return safe || DEFAULT_BRIEF;
  }

  function loadBriefScript(key) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `./briefs/${encodeURIComponent(key)}.js`;
      s.async = true;

      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Could not load: ${s.src}`));

      document.head.appendChild(s);
    });
  }

  function setText(el, value) {
    if (!el) return;
    el.textContent = value == null ? "" : String(value);
  }

  function renderError(key, err) {
    setText(qs("pageTitle"), "Link error");
    setText(qs("pageSub"), "This brief could not be loaded.");
    setText(qs("pageNote"), `Requested brief: ${key}`);

    const content = qs("content");
    if (content) {
      content.innerHTML = `
        <div class="card">
          <p><strong>Something went wrong.</strong></p>
          <p>Check that <code>/paid/briefs/${key}.js</code> exists and that it registers content.</p>
        </div>
      `;
    }

    // leave a breadcrumb in DevTools
    console.error(err);
  }

  function renderBrief(brief) {
    setText(qs("kicker"), brief.kicker || "Decision Brief");
    setText(qs("pageTitle"), brief.title || "Decision Brief");
    setText(qs("pageSub"), brief.sub || "");
    setText(qs("pageNote"), brief.note || "");

    // Optional summary card
    const summaryCard = qs("summaryCard");
    const summaryLine = qs("summaryLine");
    const objectiveLine = qs("objectiveLine");

    const hasSummary = !!(brief.summary || brief.objective);
    if (summaryCard) summaryCard.hidden = !hasSummary;

    setText(summaryLine, brief.summary || "");
    setText(objectiveLine, brief.objective || "");

    // Main content
    const content = qs("content");
    if (content) content.innerHTML = brief.bodyHtml || "<p>No content found.</p>";
  }

  async function main() {
    const key = getBriefKey();

    try {
      // Load the brief file which registers itself to window.PAID_BRIEFS
      await loadBriefScript(key);

      const registry = window.PAID_BRIEFS || {};
      const brief = registry[key];

      if (!brief) {
        throw new Error(
          `Brief "${key}" loaded but did not register. Expected window.PAID_BRIEFS["${key}"]`
        );
      }

      renderBrief(brief);
    } catch (err) {
      renderError(key, err);
    }
  }

  document.addEventListener("DOMContentLoaded", main);
})();
