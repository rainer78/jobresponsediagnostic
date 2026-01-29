/* script.js
   Minimal diagnostic wiring:
   - Reads selected radio option
   - Injects the matching FREE result copy
   - Reveals the result section and scrolls to it
   - Sets paid link dynamically based on selected result
*/

(function () {
  "use strict";

  const form = document.getElementById("diagnosticForm");
  const resultSection = document.getElementById("result");
  const resultTitle = document.getElementById("resultTitle");
  const resultContent = document.getElementById("resultContent");

  // PAID CTA (set dynamically after result selection)
  const nextMoveBtn = document.getElementById("nextMoveCta");

  // Stripe links per brief (they must pay first)
  const STRIPE_LINKS = {
    "filtering-failure": "https://buy.stripe.com/4gMbJ2b3F6e34541zU9oc00",
    "premature-disqualification": "https://buy.stripe.com/REPLACE_PREMATURE",
    "interview-drift": "https://buy.stripe.com/REPLACE_INTERVIEW",
    "conversion-breakdown": "https://buy.stripe.com/REPLACE_CONVERSION",
    "search-exhaustion": "https://buy.stripe.com/REPLACE_EXHAUSTION"
  };

  // Start disabled until a selection is made
  if (nextMoveBtn) {
    nextMoveBtn.href = "#";
    nextMoveBtn.classList.add("is-disabled");
    nextMoveBtn.setAttribute("aria-disabled", "true");
  }

  // Audit CTA can still be static
  const auditBtn = document.querySelector(".audit .secondary-cta");
  if (auditBtn) auditBtn.setAttribute("href", "#"); // or your $99 link

  // FREE result content (HTML strings)
const RESULTS = {
  "filtering-failure": {
    title: "Filtering Failure",
    html: `
      <article class="resultDoc" aria-label="Result: Filtering Failure">

        <header class="resultTop">
          <h3 class="resultTitle">Filtering Failure</h3>
          <p class="resultSummary">
            Your applications are likely being filtered out <strong>before a human sees them</strong>.
          </p>
        </header>

        <section class="resultBlock">
          <h4>What this means</h4>
          <p>
            This happens when qualified candidates rely on channels that are too crowded to transmit meaningful signal.
            The system is not evaluating you inaccurately; it is not evaluating you at all.
          </p>
          <p>
            This is one of the most common failure modes in online hiring, especially during periods of high applicant volume.
          </p>
          <p class="resultLink">
            <a href="#faq-no-response">Why do job applications get no response?</a>
          </p>
        </section>

        <section class="resultBlock">
          <h4>What this is not</h4>
          <ul>
            <li>This is not a lack of experience.</li>
            <li>This is not a resume “polish” problem.</li>
            <li>This is not a motivation or confidence issue.</li>
          </ul>
          <p>
            If your background were fundamentally wrong, you would usually receive <strong>explicit rejections</strong>.
            Silence is a different signal.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What most people do next (and why it backfires)</h4>
          <p>
            People usually apply to more roles, tweak resume keywords repeatedly, or wait longer for replies before changing approach.
          </p>
          <p>
            These actions <strong>increase exposure to the same filter</strong>, reinforcing the problem rather than solving it.
          </p>
        </section>

        <section class="resultBlock">
          <h4>The actual constraint</h4>
          <p>
            Online job boards are optimized for <strong>risk reduction</strong>, not talent discovery.
            When volume spikes, the system favors familiar titles, linear career paths, and predictable role matches.
          </p>
        </section>

        <section class="resultCallout" aria-label="What matters now">
          <h4>What matters now</h4>
          <p>
            Effort is not your bottleneck. <strong>Signal routing is.</strong>
          </p>
          <p>
            There is a correct next move that changes whether a human sees you at all.
          </p>
        </section>

      </article>
    `
  },

  "premature-disqualification": {
    title: "Premature Disqualification",
    html: `
      <article class="resultDoc" aria-label="Result: Premature Disqualification">

        <header class="resultTop">
          <h3 class="resultTitle">Premature Disqualification</h3>
          <p class="resultSummary">
            Your applications are being <strong>screened out very early</strong>, often within minutes or hours.
          </p>
        </header>

        <section class="resultBlock">
          <h4>What this means</h4>
          <p>
            This usually happens when your profile triggers automatic exclusion rules.
            The system is not weighing your strengths; it is rejecting based on perceived mismatch or risk.
          </p>
          <p>
            Unlike silence, early rejection means <strong>your application is being processed</strong>, just not favorably.
          </p>
          <p class="resultLink">
            <a href="#faq-automatic-rejection">Are job applications rejected automatically?</a>
          </p>
        </section>

        <section class="resultBlock">
          <h4>What this is not</h4>
          <ul>
            <li>This is not a lack of intelligence or capability.</li>
            <li>This is not a failure to “sell yourself harder.”</li>
            <li>This is not something more applications will fix.</li>
          </ul>
          <p>
            Fast rejection indicates a <strong>classification problem</strong>, not an effort problem.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What most people do next (and why it backfires)</h4>
          <p>
            Many people lower standards and apply broadly, add keywords to appear “more qualified,” or rewrite resumes to sound more impressive.
          </p>
          <p>
            These actions increase <strong>classification confusion</strong>, making rejection faster and more consistent.
          </p>
        </section>

        <section class="resultBlock">
          <h4>The actual constraint</h4>
          <p>
            Automated screening favors <strong>clear, narrow matches</strong>.
            If your background spans adjacent roles, mixed seniority signals, or transferable skills, you are more likely to be rejected early, even when qualified.
          </p>
        </section>

        <section class="resultCallout" aria-label="What matters now">
          <h4>What matters now</h4>
          <p>
            The issue is not depth. It’s <strong>positioning precision</strong>.
          </p>
          <p>
            There is a specific adjustment that reduces early rejection and improves downstream evaluation.
          </p>
        </section>

      </article>
    `
  },

  "interview-drift": {
    title: "Interview Drift",
    html: `
      <article class="resultDoc" aria-label="Result: Interview Drift">

        <header class="resultTop">
          <h3 class="resultTitle">Interview Drift</h3>
          <p class="resultSummary">
            You reach interviews, but the process <strong>loses momentum</strong> before decisions are made.
          </p>
        </header>

        <section class="resultBlock">
          <h4>What this means</h4>
          <p>
            Interviewers may understand your competence, but not your <strong>specific value</strong> in the role they are hiring for.
            You are not failing interviews. You are failing to <strong>anchor a decision</strong>.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What this is not</h4>
          <ul>
            <li>This is not poor communication.</li>
            <li>This is not interview nerves.</li>
            <li>This is not “culture fit” in the casual sense.</li>
          </ul>
          <p>
            If you were fundamentally misaligned, you would not progress at all.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What most people do next (and why it backfires)</h4>
          <p>
            People often over-prepare answers, study frameworks, or try to sound more confident or enthusiastic.
          </p>
          <p>
            This adds polish without adding <strong>decision clarity</strong>.
          </p>
        </section>

        <section class="resultBlock">
          <h4>The actual constraint</h4>
          <p>
            Hiring teams need to answer one question: <strong>“Why this person for this role right now?”</strong>
            If that answer stays fuzzy, the process stalls, even when interviews go well.
          </p>
        </section>

        <section class="resultCallout" aria-label="What matters now">
          <h4>What matters now</h4>
          <p>
            You need a <strong>clear positioning spine</strong> that interviewers can remember and defend.
          </p>
          <p>
            There is a way to re-anchor interviews so momentum returns.
          </p>
        </section>

      </article>
    `
  },

  "conversion-breakdown": {
    title: "Conversion Breakdown",
    html: `
      <article class="resultDoc" aria-label="Result: Conversion Breakdown">

        <header class="resultTop">
          <h3 class="resultTitle">Conversion Breakdown</h3>
          <p class="resultSummary">
            You get interest, but nothing converts into an offer because you are seen as <strong>viable</strong>, not <strong>necessary</strong>.
          </p>
        </header>

        <section class="resultBlock">
          <h4>What this means</h4>
          <p>
            Interest without commitment is a signal that differentiation is missing at the final decision point.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What this is not</h4>
          <ul>
            <li>This is not bad timing.</li>
            <li>This is not hidden competition.</li>
            <li>This is not something that will “eventually click” without a change.</li>
          </ul>
          <p>
            Repeated near-misses indicate a <strong>closing problem</strong>, not a proximity one.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What most people do next (and why it backfires)</h4>
          <p>
            Many people accept vague feedback, wait for future openings, or assume the next round will be different.
          </p>
          <p>
            This delays correction and normalizes non-decision.
          </p>
        </section>

        <section class="resultBlock">
          <h4>The actual constraint</h4>
          <p>
            Final hiring decisions are comparative.
            If your value is not clearly distinct at the moment of choice, the safest option usually wins, even if it’s less capable.
          </p>
        </section>

        <section class="resultCallout" aria-label="What matters now">
          <h4>What matters now</h4>
          <p>
            You don’t need more interviews. You need a <strong>decisive contrast</strong> at the point of selection.
          </p>
          <p>
            There is a correct way to shift how final decisions are framed.
          </p>
        </section>

      </article>
    `
  },

  "search-exhaustion": {
    title: "Search Exhaustion",
    html: `
      <article class="resultDoc" aria-label="Result: Search Exhaustion">

        <header class="resultTop">
          <h3 class="resultTitle">Search Exhaustion</h3>
          <p class="resultSummary">
            You slowed down because the process stopped producing signal, not because you “gave up.”
          </p>
        </header>

        <section class="resultBlock">
          <h4>What this means</h4>
          <p>
            This is a <strong>rational response</strong> to repeated negative feedback loops.
            When effort stops producing signal, people conserve energy.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What this is not</h4>
          <ul>
            <li>This is not laziness.</li>
            <li>This is not lack of ambition.</li>
            <li>This is not fear of rejection.</li>
          </ul>
          <p>
            This is what happens when success criteria stay unclear for too long.
          </p>
        </section>

        <section class="resultBlock">
          <h4>What most people do next (and why it backfires)</h4>
          <p>
            People take long breaks without changing strategy, consume motivational content, or wait to “feel ready again.”
          </p>
          <p>
            None of these restore traction.
          </p>
        </section>

        <section class="resultBlock">
          <h4>The actual constraint</h4>
          <p>
            Momentum doesn’t return through motivation. It returns through <strong>predictable feedback</strong>.
            Without visible signal that effort leads somewhere, engagement shuts down.
          </p>
        </section>

        <section class="resultCallout" aria-label="What matters now">
          <h4>What matters now</h4>
          <p>
            The priority is not intensity. It’s <strong>re-establishing a reliable response signal</strong>.
          </p>
          <p>
            There is a way to re-enter the process without restarting the entire search.
          </p>
        </section>

      </article>
    `
  }
};

  function showResult(key) {
    const data = RESULTS[key];
    if (!data) return;

    resultTitle.textContent = data.title;
    resultContent.innerHTML = data.html;

    // ✅ Enable paid button + set correct Stripe link after selection
    if (nextMoveBtn) {
      nextMoveBtn.href = STRIPE_LINKS[key] || "#";
      nextMoveBtn.classList.remove("is-disabled");
      nextMoveBtn.setAttribute("aria-disabled", "false");
    }

    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getSelectedValue() {
    const chosen = form.querySelector('input[name="result"]:checked');
    return chosen ? chosen.value : null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const value = getSelectedValue();
    if (!value) {
      alert("Please select the option that best matches what happens next.");
      return;
    }

    showResult(value);
  });
})();
