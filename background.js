async function updateBadge(tabCount) {
  const currentTabs = await getTabOpenTabs();
  if (tabCount > 8) {
    const toBeRemoved = currentTabs.shift()
    closeTab(toBeRemoved)
  }

}
function updateTabCount() {
  chrome.tabs.query({}, (tabs) => {
    updateBadge(tabs.length);
  });
}

const closeTab = (tab) => {
  chrome.tabs.remove(tab);
};

const getTabOpenTabs = () => {
  return new Promise((resolve, reject) => {
    const openTabs = [];

    chrome.windows.getAll({ populate: true }, function (windows) {
      windows.forEach(function (window) {
        window.tabs.forEach(function (tab) {
          openTabs.push(tab.id);
        });
      });

      resolve(openTabs);
    });
  });
};

updateTabCount();
chrome.tabs.onCreated.addListener(updateTabCount);
chrome.tabs.onRemoved.addListener(updateTabCount);
