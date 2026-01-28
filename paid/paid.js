(function () {
  "use strict";

  const titleEl = document.getElementById("pageTitle");
  const contentEl = document.getElementById("content");

  const params = new URLSearchParams(window.location.search);
  const brief = params.get("brief");

  // Minimal render so we can verify the plumbing works
  titleEl.textContent = brief ? `Brief: ${brief}` : "Brief missing";

  contentEl.innerHTML = brief
    ? `<div class="card"><p>Loaded brief key: <strong>${brief}</strong></p></div>`
    : `<div class="card"><p><strong>No brief key found.</strong> Your link should include <code>?brief=filtering-failure</code></p></div>`;
})();
