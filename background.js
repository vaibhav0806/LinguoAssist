let selectedWord = "";
let def = "";

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
    selectedWord = info.selectionText;
    def = await logJSONData(selectedWord);
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icons/icon-32.png",
        title: selectedWord.charAt(0).toUpperCase() + selectedWord.substring(1),
        message: def,
        requireInteraction: true,
        buttons: [
          {
            title: "Search on Google",
          },
          {
            title: "Close",
          },
        ],
      },
      (notificationId) => {
        console.log("Notification created with ID:", notificationId);
      }
    );
  }
});

chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      chrome.tabs.create({
        url: `https://www.google.com/search?q=define+${selectedWord}`,
      });
    }
  }
);
