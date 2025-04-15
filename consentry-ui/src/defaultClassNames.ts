import { ConsentManagerClassNames } from "./types";

export const defaultClassNames: ConsentManagerClassNames = {
  wrapper: "consent-wrapper",

  banner: {
    container: "cookie-banner",
    header: "cookie-banner-header",
    title: "cookie-banner-title",
    message: "cookie-banner-message",
    closeButton: "cookie-banner-close-button",
    buttonRow: "cookie-banner-button-row",
    acceptButton: "cookie-banner-accept-button",
    rejectButton: "cookie-banner-reject-button",
    customizeButton: "cookie-banner-customize-button",
    content: "cookie-banner-content",
  },

  modal: {
    overlay: "cookie-modal-overlay",
    container: "cookie-modal-container",
    title: "cookie-modal-title",
    section: "cookie-modal-section",
    row: "cookie-modal-row",
    rowText: "cookie-modal-row-text",
    rowTitle: "cookie-modal-row-title",
    rowDescription: "cookie-modal-row-description",
    toggleSwitch: "cookie-modal-switch",
    toggleThumb: "cookie-modal-switch-thumb",
    buttonRow: "cookie-modal-button-row",
    saveButton: "cookie-modal-save-button",
    cancelButton: "cookie-modal-cancel-button",
  },

  settingsButton: "cookie-settings-button",
};
