async function logJSONData(str) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${str}`
  );
  const jsonData = await response.json();
  const def = jsonData[0].meanings[0].definitions[0].definition;
  return def;
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Define "%s"',
    contexts: ["selection"],
    id: "myContextMenuId",
  });
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === "myContextMenuId") {
    const selectedWord = info.selectionText;
    const def = await logJSONData(selectedWord);
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icons/icon-16.png",
        title: selectedWord.charAt(0).toUpperCase() + selectedWord.substring(1),
        message: def,
      },
      (notificationId) => {
        console.log("Notification created with ID:", notificationId);
      }
    );
  }
});
