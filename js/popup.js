(() => {
  "use strict";

  const localStorageIdentifier = "ff-key";

  const addItemForm = document.getElementById("add-shortcut");

  const table = document.createElement("table");
  const setHotkey = (pair) => {
    chrome.storage.local.get([localStorageIdentifier], function (e) {
      let pervData = e[localStorageIdentifier] ?? [];
      chrome.storage.local.set({
        [localStorageIdentifier]: [...pervData, pair],
      });
      addEntry(pair);
    });
  };

  const getFormValuesWithName = () => {
    const values = {};

    Array.from(addItemForm.children).forEach((element) => {
      if (!element.name) return;
      values[element.name] = element.value;
    });
    return values;
  };

  addItemForm.onsubmit = function (e) {
    e.preventDefault();

    const shortcut = getFormValuesWithName();

    setHotkey(shortcut);
    e.target.reset();
  };

  function showMappings() {
    chrome.storage.local.get([localStorageIdentifier], function (e) {
      const shortcuts = e[localStorageIdentifier];
      const container = document.getElementById("mappings");

      shortcuts.forEach((item) => addEntry(item));

      container.appendChild(table);
    });
  }

  function removeEntry(key) {
    chrome.storage.local.get([localStorageIdentifier], function (e) {
      const shortcuts = e[localStorageIdentifier].filter(
        (item) => item.key !== key
      );
      chrome.storage.local.set({ [localStorageIdentifier]: shortcuts });
    });
  }

  function addEntry({ key, value }) {
    const tableDataStyles = {
      border: "1px solid #dddddd",
      textAlign: "left",
      padding: "8px",
    };
    const row = table.insertRow();

    const keyCell = row.insertCell();
    keyCell.style = tableDataStyles;
    keyCell.textContent = key;

    const valueCell = row.insertCell();
    valueCell.style = tableDataStyles;
    valueCell.textContent = value;

    const deleteBtn = document.createElement("button");
    deleteBtn.onclick = function () {
      removeEntry(key);
      row.remove();
    };

    const deleteBtnCell = row.insertCell();
    deleteBtn.innerText = "Remove";
    deleteBtnCell.appendChild(deleteBtn);
  }

  showMappings();
})();
