("use strict");

const localStorageIdentifier = "ff-key";
chrome.storage.local.get([localStorageIdentifier], function (e) {
  if (e[localStorageIdentifier]) return;
  chrome.storage.local.set({ [localStorageIdentifier]: [] });
});

let lastFocused;
document.addEventListener(
  "focusin",
  (e) => {
    let focusedElement = e.target;
    if (lastFocused === focusedElement) return;
    lastFocused = focusedElement;

    if (
      focusedElement instanceof HTMLInputElement ||
      focusedElement instanceof HTMLTextAreaElement
    ) {
      if (
        !focusedElement.__eventListeners ||
        !focusedElement.__eventListeners["input"] ||
        !focusedElement.__eventListeners["input"].includes(setInputValue)
      ) {
        addEventListenerOnce(focusedElement, "input", setInputValue);
      }
    }
  },
  { bubbles: true }
);

let updatedValue;
const setInputValue = (e) => {
  if (e.target.value === updatedValue) return;

  chrome.storage.local.get([localStorageIdentifier], function (data) {
    updatedValue = getUpdatedValue(
      e.target.value,
      data[localStorageIdentifier]
    );
    if (e.target.value === updatedValue) return;
    e.preventDefault();

    const event = new Event("input", { bubbles: true });
    e.target.value = updatedValue;
    e.target.dispatchEvent(event);
  });
};

const getUpdatedValue = (inputValue, mappings) => {
  const [key] = inputValue.match(new RegExp(/@\w+$/g)) ?? [null];
  if (key) {
    mappings.find((shortcut) => {
      if (`@${shortcut.key}` === key) {
        inputValue = inputValue.replace(key, shortcut.value);
        return true;
      }
      return false;
    });
  }
  return inputValue;
};

const addEventListenerOnce = (element, eventName, listener) => {
  if (!element.__eventListeners) {
    element.__eventListeners = {};
  }
  if (!element.__eventListeners[eventName]) {
    element.__eventListeners[eventName] = [];
  }
  if (!element.__eventListeners[eventName].includes(listener)) {
    element.addEventListener(eventName, listener);
    element.__eventListeners[eventName].push(listener);
  }
};
