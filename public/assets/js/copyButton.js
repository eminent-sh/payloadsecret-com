class CopyButton {
  constructor(buttonElement, getValue, eventLabel) {
    this.button = buttonElement;
    this.getValue = getValue;
    this.eventLabel = eventLabel;
    this.icon = this.button.querySelector(".icon");
    this.initialLabel = this.icon
      ? this.icon.textContent
      : this.button.textContent;
    this.setupEventListeners();
  }

  async copyToClipboard() {
    try {
      const value = this.getValue();
      if (!value) return;

      await navigator.clipboard.writeText(value);
      this.showCopiedFeedback();

      gtag("event", "copy_secret", {
        event_category: "Interaction",
        event_label: this.eventLabel,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);

      gtag("event", "copy_error", {
        event_category: "Error",
        event_label: err.message,
      });
    }
  }

  showCopiedFeedback() {
    this.icon.textContent = "✓";
    setTimeout(() => {
      this.icon.textContent = this.initialLabel;
    }, 2000);
  }

  setupEventListeners() {
    this.button.addEventListener("click", () => this.copyToClipboard());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copyBtn");
  new CopyButton(copyBtn, () => window.getSecret(), "Copy Secret");

  const copyEnvBtn = document.getElementById("copyEnvBtn");
  new CopyButton(copyEnvBtn, () => window.getEnvLine(), "Copy Env Line");
});
