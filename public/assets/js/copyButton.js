class CopyButton {
  constructor(buttonElement) {
    this.button = buttonElement;
    this.copyIcon = this.button.querySelector(".icon");
    this.initialIcon = this.copyIcon.textContent;
    this.setupEventListeners();
  }

  async copyToClipboard() {
    try {
      const value = window.getSecret();
      if (!value) return;

      await navigator.clipboard.writeText(value);
      this.showCopiedFeedback();

      // Track successful copy
      gtag("event", "copy_secret", {
        event_category: "Interaction",
        event_label: "Copy Secret",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);

      // Track copy failure
      gtag("event", "copy_error", {
        event_category: "Error",
        event_label: err.message,
      });
    }
  }

  showCopiedFeedback() {
    this.copyIcon.textContent = "✓";
    setTimeout(() => {
      this.copyIcon.textContent = this.initialIcon;
    }, 2000);
  }

  setupEventListeners() {
    this.button.addEventListener("click", () => this.copyToClipboard());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const copyBtn = document.getElementById("copyBtn");
  new CopyButton(copyBtn);
});
