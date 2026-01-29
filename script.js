/* script.js
   Minimal diagnostic wiring:
   - Reads selected radio option
   - Injects the matching FREE result copy
   - Reveals the result section and scrolls to it
   - (Optional) sets your paid links in one place
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
  "filtering-failure": "https://buy.stripe.com/REPLACE_FILTERING",
  "premature-disqualification": "https://buy.stripe.com/REPLACE_PREMATURE",
  "interview-drift": "https://buy.stripe.com/REPLACE_INTERVIEW",
  "conversion-breakdown": "https://buy.stripe.com/REPLACE_CONVERSION",
  "search-exhaustion": "https://buy.stripe.com/REPLACE_EXHAUSTION"
};
   if (nextMoveBtn) {
  nextMoveBtn.href = STRIPE_LINKS[key] || "#";
  nextMoveBtn.classList.remove("is-disabled");
  nextMoveBtn.setAttribute("aria-disabled", "false");
}

   if (nextMoveBtn) {
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
        <p><strong>What this result means</strong></p>
        <p>Your applications are likely being filtered out <strong>before a human ever sees them</strong>.</p>
        <p>This happens when qualified candidates rely on channels that are too crowded to transmit meaningful signal. The system is not evaluating you inaccurately; it is not evaluating you at all.</p>
        <p>This is one of the most common failure modes in online hiring, especially during periods of high applicant volume.</p>

        <p><strong>What this is not</strong></p>
        <ul>
          <li>This is not a lack of experience</li>
          <li>This is not a resume “polish” problem</li>
          <li>This is not a motivation or confidence issue</li>
        </ul>
        <p>If your background were fundamentally wrong, you would usually receive <strong>explicit rejections</strong>. Silence is a different signal.</p>

        <p><strong>What most people do next (and why it backfires)</strong></p>
        <p>When people experience Filtering Failure, they usually respond by applying to more roles, tweaking resume keywords repeatedly, or waiting longer for replies before changing approach.</p>
        <p>These actions <strong>increase exposure to the same filter</strong>, reinforcing the problem rather than solving it.</p>

        <p><strong>The actual constraint</strong></p>
        <p>Online job boards are optimized for <strong>risk reduction</strong>, not talent discovery. When volume spikes, the system favors familiar titles, linear career paths, and predictable role matches.</p>

        <p><strong>What matters now</strong></p>
        <p>At this stage, effort is not your bottleneck. <strong>Signal routing is.</strong></p>
        <p>There is a correct next move that changes whether a human sees you at all.</p>
      `
    },

    "premature-disqualification": {
      title: "Premature Disqualification",
      html: `
        <p><strong>What this result means</strong></p>
        <p>Your applications are being <strong>screened out very early</strong>, often within minutes or hours.</p>
        <p>This usually happens when your profile triggers automatic exclusion rules. The system is not weighing your strengths; it is rejecting based on perceived mismatch or risk.</p>
        <p>Unlike silence, early rejection means <strong>your application is being processed</strong>, just not favorably.</p>

        <p><strong>What this is not</strong></p>
        <ul>
          <li>This is not a lack of intelligence or capability</li>
          <li>This is not a failure to “sell yourself harder”</li>
          <li>This is not something more applications will fix</li>
        </ul>
        <p>Fast rejection indicates a <strong>classification problem</strong>, not an effort problem.</p>

        <p><strong>What most people do next (and why it backfires)</strong></p>
        <p>Most people respond by lowering standards and applying broadly, adding keywords to appear “more qualified,” or rewriting resumes to sound more impressive.</p>
        <p>These actions increase <strong>classification confusion</strong>, making rejection faster and more consistent.</p>

        <p><strong>The actual constraint</strong></p>
        <p>Automated screening systems favor <strong>clear, narrow matches</strong>. If your background spans adjacent roles, mixed seniority signals, or transferable skills, you are more likely to be rejected early, even when qualified.</p>

        <p><strong>What matters now</strong></p>
        <p>The issue is not depth. It’s <strong>positioning precision</strong>.</p>
        <p>There is a specific adjustment that reduces early rejection and improves downstream evaluation.</p>
      `
    },

    "interview-drift": {
      title: "Interview Drift",
      html: `
        <p><strong>What this result means</strong></p>
        <p>You are passing initial screens and reaching interviews, but the process <strong>loses momentum</strong>.</p>
        <p>This usually indicates that interviewers understand your competence, but not your <strong>specific value</strong> in the role they are hiring for.</p>
        <p>You are not failing interviews. You are failing to <strong>anchor a decision</strong>.</p>

        <p><strong>What this is not</strong></p>
        <ul>
          <li>This is not poor communication</li>
          <li>This is not interview nerves</li>
          <li>This is not “culture fit” in the casual sense</li>
        </ul>
        <p>If you were fundamentally misaligned, you would not progress at all.</p>

        <p><strong>What most people do next (and why it backfires)</strong></p>
        <p>People often respond by over-preparing answers, studying interview frameworks, or trying to sound more confident or enthusiastic.</p>
        <p>This adds polish without adding <strong>decision clarity</strong>.</p>

        <p><strong>The actual constraint</strong></p>
        <p>Hiring teams need to answer one question: <strong>“Why this person for this role right now?”</strong></p>
        <p>If that answer remains fuzzy, the process stalls, even when interviews go well.</p>

        <p><strong>What matters now</strong></p>
        <p>You don’t need broader answers. You need a <strong>clear positioning spine</strong> that interviewers can remember and defend.</p>
        <p>There is a way to re-anchor interviews so momentum returns.</p>
      `
    },

    "conversion-breakdown": {
      title: "Conversion Breakdown",
      html: `
        <p><strong>What this result means</strong></p>
        <p>Recruiters or hiring teams express interest, but nothing converts into an offer.</p>
        <p>This usually means you are seen as <strong>viable</strong>, but not <strong>necessary</strong>.</p>
        <p>Interest without commitment is a signal that differentiation is missing at the final decision point.</p>

        <p><strong>What this is not</strong></p>
        <ul>
          <li>This is not bad timing</li>
          <li>This is not hidden competition</li>
          <li>This is not “almost there”</li>
        </ul>
        <p>Repeated near-misses indicate a <strong>closing problem</strong>, not a proximity one.</p>

        <p><strong>What most people do next (and why it backfires)</strong></p>
        <p>Most people respond by accepting vague feedback, waiting for future openings, or assuming it will eventually click.</p>
        <p>This delays correction and normalizes non-decision.</p>

        <p><strong>The actual constraint</strong></p>
        <p>Final hiring decisions are comparative. If your value is not clearly distinct at the moment of choice, the safest option usually wins, even if it’s less capable.</p>

        <p><strong>What matters now</strong></p>
        <p>You don’t need more interviews. You need a <strong>decisive contrast</strong> at the point of selection.</p>
        <p>There is a correct way to shift how final decisions are framed.</p>
      `
    },

    "search-exhaustion": {
      title: "Search Exhaustion",
      html: `
        <p><strong>What this result means</strong></p>
        <p>You have reduced or stopped applying because the process feels pointless.</p>
        <p>This is not disengagement. It is a <strong>rational response</strong> to repeated negative feedback loops.</p>
        <p>When effort stops producing signal, the system trains people to conserve energy.</p>

        <p><strong>What this is not</strong></p>
        <ul>
          <li>This is not laziness</li>
          <li>This is not lack of ambition</li>
          <li>This is not fear of rejection</li>
        </ul>
        <p>This is what happens when success criteria are unclear for too long.</p>

        <p><strong>What most people do next (and why it backfires)</strong></p>
        <p>People often respond by taking long breaks without strategy changes, consuming motivational content, or waiting to “feel ready again.”</p>
        <p>None of these restore traction.</p>

        <p><strong>The actual constraint</strong></p>
        <p>Momentum doesn’t return through motivation. It returns through <strong>predictable feedback</strong>.</p>
        <p>Without a visible signal that effort leads somewhere, the system shuts down engagement.</p>

        <p><strong>What matters now</strong></p>
        <p>The priority is not intensity. It’s <strong>re-establishing a reliable response signal</strong>.</p>
        <p>There is a way to re-enter the process without restarting the entire search.</p>
      `
    }
  };

  function showResult(key) {
    const data = RESULTS[key];
    if (!data) return;

    resultTitle.textContent = data.title;
    resultContent.innerHTML = data.html;

    // Reveal result section
    resultSection.classList.remove("hidden");

    // Scroll to it (smooth if supported)
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

