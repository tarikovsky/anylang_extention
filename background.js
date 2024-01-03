let scriptEnabled = false;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "toggleScript") {
            scriptEnabled = !scriptEnabled;
            sendResponse({ scriptEnabled: scriptEnabled });
            updateContentScripts();
        } else if (request.action === "queryStatus") {
            sendResponse({ scriptEnabled: scriptEnabled });
        }
    }
);
chrome.tabs.onActivated.addListener(function (activeInfo) {
    // Когда вкладка активирована, отправляем состояние в эту вкладку
    chrome.tabs.sendMessage(activeInfo.tabId, { action: "scriptStatus", status: scriptEnabled });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Когда страница загружена (или обновлена)
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.tabs.sendMessage(tabId, { action: "scriptStatus", status: scriptEnabled });
    }
});
function updateContentScripts() {
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: "scriptStatus", status: scriptEnabled });
        });
    });
}