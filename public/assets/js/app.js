document.addEventListener("DOMContentLoaded", () => {
  const state = {
    secret: "",
    showSecret: false,
    showUsage: false,
  };

  window.getSecret = () => state.secret;

  const elements = {
    generateBtn: document.getElementById("generateBtn"),
    usageBtn: document.getElementById("usageBtn"),
    secretContainer: document.getElementById("secretContainer"),
    secretField: document.getElementById("secretField"),
    toggleVisibilityBtn: document.getElementById("toggleVisibilityBtn"),
    usageInfo: document.getElementById("usageInfo"),
    eyeIcon: document.getElementById("eyeIcon"),
  };

  // Track page engagement time
  let startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    gtag("event", "time_spent", {
      event_category: "Engagement",
      event_label: "Time on Page",
      value: timeSpent,
    });
  });

  function generateSecret() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    state.secret = btoa(String.fromCharCode(...array));
    updateSecretDisplay();
    elements.secretContainer.classList.remove("hidden");

    // Track secret generation
    gtag("event", "generate_secret", {
      event_category: "Interaction",
      event_label: "Generate Secret",
    });
  }

  function updateSecretDisplay() {
    const displayedSecret = state.showSecret
      ? state.secret
      : state.secret.slice(0, 8) + "•".repeat(state.secret.length - 8);
    elements.secretField.textContent = displayedSecret;
  }

  function toggleSecretVisibility() {
    state.showSecret = !state.showSecret;
    updateSecretDisplay();
    elements.eyeIcon.textContent = state.showSecret ? "🙈" : "🙉";

    // Track secret visibility toggle
    gtag("event", "toggle_visibility", {
      event_category: "Interaction",
      event_label: state.showSecret ? "Show Secret" : "Hide Secret",
    });
  }

  function toggleUsage() {
    state.showUsage = !state.showUsage;
    elements.usageInfo.classList.toggle("hidden");

    // Track usage info toggle
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
