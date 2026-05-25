document.addEventListener("DOMContentLoaded", () => {
  const state = {
    secret: "",
    showSecret: false,
  };

  const PLACEHOLDER_ENV_LINE = 'PAYLOAD_SECRET="generate a secret above"';

  window.getSecret = () => state.secret;
  window.getEnvLine = () =>
    state.secret ? `PAYLOAD_SECRET="${state.secret}"` : "";

  const elements = {
    secretField: document.getElementById("secretField"),
    toggleVisibilityBtn: document.getElementById("toggleVisibilityBtn"),
    refreshBtn: document.getElementById("refreshBtn"),
    liveEnvExample: document.getElementById("liveEnvExample"),
    copyEnvBtn: document.getElementById("copyEnvBtn"),
    eyeIcon: document.getElementById("eyeIcon"),
  };

  let startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    gtag("event", "time_spent", {
      event_category: "Engagement",
      event_label: "Time on Page",
      value: timeSpent,
    });
  });

  function getDisplayedSecret() {
    if (!state.secret) return "";
    return state.showSecret
      ? state.secret
      : state.secret.slice(0, 8) + "•".repeat(state.secret.length - 8);
  }

  function updateSecretDisplay() {
    elements.secretField.textContent = getDisplayedSecret();
    updateLiveEnvExample();
  }

  function updateLiveEnvExample() {
    if (!state.secret) {
      elements.liveEnvExample.textContent = PLACEHOLDER_ENV_LINE;
      elements.copyEnvBtn.disabled = true;
      return;
    }

    elements.liveEnvExample.textContent = `PAYLOAD_SECRET="${getDisplayedSecret()}"`;
    elements.copyEnvBtn.disabled = false;
  }

  function generateSecret(isRefresh) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    state.secret = btoa(String.fromCharCode(...array));
    updateSecretDisplay();

    if (isRefresh) {
      gtag("event", "regenerate_secret", {
        event_category: "Interaction",
        event_label: "Regenerate Secret",
      });
    } else {
      gtag("event", "generate_secret", {
        event_category: "Interaction",
        event_label: "Auto Generate Secret",
      });
    }
  }

  function toggleSecretVisibility() {
    state.showSecret = !state.showSecret;
    updateSecretDisplay();
    elements.eyeIcon.textContent = state.showSecret ? "🙈" : "🙉";

    gtag("event", "toggle_visibility", {
      event_category: "Interaction",
      event_label: state.showSecret ? "Show Secret" : "Hide Secret",
    });
  }

  function setupTabs() {
    const tabs = document.querySelectorAll(".tabs .tab");
    const panels = document.querySelectorAll(".tab-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");

        panels.forEach((panel) => {
          if (panel.dataset.panel === target) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });

        gtag("event", "switch_tab", {
          event_category: "Interaction",
          event_label: target,
        });
      });
    });
  }

  elements.refreshBtn.addEventListener("click", () => generateSecret(true));
  elements.toggleVisibilityBtn.addEventListener("click", toggleSecretVisibility);

  setupTabs();
  generateSecret(false);
});
