chrome.storage.local.get(["key"]).then((result) => {
  const tag = document.getElementById("dataContainer");
  tag.innerHTML = result.key;
});
