let selectedWord = "";
let def = "";

async function logJSONData(str) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${str}`
  );
  console.log(response.status);
  if (response.status === 200) {
    const jsonData = await response.json();
    const def = jsonData[0].meanings[0].definitions[0].definition;
    return def;
  } else {
    return null;
  }
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Define "%s"',
    contexts: ["selection"],
    id: "defineContextMenu",
  });
});

chrome.contextMenus.onClicked.addListener(async function (info, tab) {
  if (info.menuItemId === "defineContextMenu") {
    selectedWord = info.selectionText;
    def = await logJSONData(selectedWord);
    if (!def) {
      selectedWord = "No Definitions Found";
      def =
        "Sorry pal, we couldn't find definitions for the word you were looking for.";
    } else {
      selectedWord =
        selectedWord.charAt(0).toUpperCase() + selectedWord.substring(1);
    }
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icons/icon-32.png",
        title: selectedWord,
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
    } else if (buttonIndex === 1) {
      chrome.notifications.clear(notificationId, () =>
        console.log("CLosed notification", notificationId)
      );
    }
  }
);
