(function () {
  "use strict";

  // Single place to control page behavior across ALL paid briefs
  const SETTINGS = {
    disableRightClick: true,
    blockShortcuts: true,
    // If you want printing allowed later, set this to false.
    blockPrint: true,
    // If you want view-source allowed later, set this to false.
    blockViewSource: true,
  };

  function applyGuards() {
    if (SETTINGS.disableRightClick) {
      document.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    if (SETTINGS.blockShortcuts) {
      document.addEventListener("keydown", (e) => {
        const key = (e.key || "").toLowerCase();
        const mod = e.ctrlKey || e.metaKey;

        if (!mod) return;

        // Always block Save/Copy
        if (key === "s" || key === "c") e.preventDefault();

        // Conditional blocks
        if (SETTINGS.blockViewSource && key === "u") e.preventDefault();
        if (SETTINGS.blockPrint && key === "p") e.preventDefault();
      });
    }
  }

  function getBriefKey() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("brief") || "filtering-failure").trim();
  }

  function loadBriefScript(key) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `./briefs/${encodeURIComponent(key)}.js`;
      s.onload = resolve;
      s.onerror = () => reject(new Error(`Brief not found: ${key}`));
      document.head.appendChild(s);
    });
  }

  function render(brief) {
    // Header fields
    document.title = `${brief.title} – Decision Brief`;
    document.getElementById("pageTitle").textContent = brief.title;
    document.getElementById("pageSub").textContent = brief.subheading || "";
    document.getElementById("pageNote").textContent = brief.note || "";

    // Summary card
    const summaryCard = document.getElementById("summaryCard");
    if (brief.summary || brief.objective) {
      summaryCard.hidden = false;
      document.getElementById("summaryLine").innerHTML = brief.summary || "";
      document.getElementById("objectiveLine").innerHTML = brief.objective || "";
    }

    // Body sections
    const content = document.getElementById("content");
    content.innerHTML = "";

    (brief.sections || []).forEach((sec) => {
      const el = document.createElement("section");
      el.className = "section" + (sec.divider ? " divider" : "");
      el.innerHTML = `
        <h2>${sec.heading}</h2>
        ${sec.html || ""}
      `;
      content.appendChild(el);
    });

    // Footer
    if (brief.footerNote) {
      document.getElementById("footerNote").textContent = brief.footerNote;
    }
  }

  async function init() {
    applyGuards();

    const key = getBriefKey();
    try {
      await loadBriefScript(key);
      if (!window.PAID_BRIEF) throw new Error("PAID_BRIEF not defined.");
      render(window.PAID_BRIEF);
    } catch (err) {
      document.getElementById("pageTitle").textContent = "Brief not available";
      document.getElementById("pageSub").textContent =
        "This link may be incorrect, expired, or missing the referenced brief.";
      document.getElementById("content").innerHTML =
        `<section class="section"><p><strong>Error:</strong> ${err.message}</p></section>`;
    }
  }

  init();
})();

