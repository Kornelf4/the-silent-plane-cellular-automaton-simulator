document.getElementById("copyData").addEventListener("click", () => setClipboard(JSON.stringify(selectedRuleset)));
document.getElementById("pasteData").addEventListener("click", async () => {
    try {
        let pastedData = JSON.parse(await navigator.clipboard.readText());
        if(pastedData.checkedLocations === undefined || pastedData.conditionList === undefined) {
            alert("Ruleset on clipboard is invalid.")
        }
        selectedRuleset.checkedLocations = pastedData.checkedLocations;
        selectedRuleset.conditionList = pastedData.conditionList;
        updateDisplay();
    } catch(e) {
        alert("Failed to paste from clipboard. (It might not work on itch.io)")
    }
});
async function setClipboard(text) {
  const type = "text/plain";
  const clipboardItemData = {
    [type]: text,
  };
  const clipboardItem = new ClipboardItem(clipboardItemData);
  await navigator.clipboard.write([clipboardItem]);
}