(function () {
  "use strict";
  const localStorageIdentifier = "ff-key";
  updateStorage();

  const elements = document.querySelectorAll(
    "input[type=text]",
    "input[type=text]",
    "input[type=search]",
    "input[type=url]",
    "input[type=checkbox]"
  );
  elements.forEach((element) => {
    element.addEventListener("input", function setInputValue(e) {
      chrome.storage.local.get([localStorageIdentifier], function (data) {
        const val = getShortcutValue(
          e.target.value,
          data[localStorageIdentifier]
        );
        if (!val) return;
        e.preventDefault();

        const event = new Event("input", { bubbles: true });
        e.target.value = val;
        e.target.dispatchEvent(event);
      });
    });
  });

  function updateStorage() {
    chrome.storage.local.get([localStorageIdentifier], function (e) {
      if (e[localStorageIdentifier]) return;
      chrome.storage.local.set({ [localStorageIdentifier]: [] });
    });
  }

  function getShortcutValue(value, shortcuts) {
    let val = "";
    if (new RegExp(/^@/).test(value)) {
      shortcuts.find((shortcut) => {
        if (shortcut.key === value.replace("@", "")) {
          val = shortcut.value;
          return true;
        }
        return false;
      });
    }
    return val;
  }
})();
