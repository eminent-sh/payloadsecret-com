document.addEventListener("DOMContentLoaded", () => {
  const state = {
    secret: "",
    showSecret: false,
    showUsage: false,
  };

  const PLACEHOLDER_ENV_LINE = 'PAYLOAD_SECRET="generate a secret above"';

  window.getSecret = () => state.secret;
  window.getEnvLine = () =>
    state.secret ? `PAYLOAD_SECRET="${state.secret}"` : "";

  const elements = {
    generateBtn: document.getElementById("generateBtn"),
    usageBtn: document.getElementById("usageBtn"),
    secretContainer: document.getElementById("secretContainer"),
    secretField: document.getElementById("secretField"),
    toggleVisibilityBtn: document.getElementById("toggleVisibilityBtn"),
    usageInfo: document.getElementById("usageInfo"),
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

  function generateSecret() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    state.secret = btoa(String.fromCharCode(...array));
    updateSecretDisplay();
    elements.secretContainer.classList.remove("hidden");

    gtag("event", "generate_secret", {
      event_category: "Interaction",
      event_label: "Generate Secret",
    });
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

  function toggleUsage() {
    state.showUsage = !state.showUsage;
    elements.usageInfo.classList.toggle("hidden");

    gtag("event", "toggle_usage", {
      event_category: "Interaction",
      event_label: state.showUsage ? "Show Usage" : "Hide Usage",
    });
  }

  elements.generateBtn.addEventListener("click", generateSecret);
  elements.toggleVisibilityBtn.addEventListener(
    "click",
    toggleSecretVisibility
  );
  elements.usageBtn.addEventListener("click", toggleUsage);
});
