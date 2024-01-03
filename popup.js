const button = document.getElementById('goBtn');

// Запрашиваем текущее состояние скрипта
document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ action: "queryStatus" }, function (response) {
        updateButton(response.scriptEnabled);
    });
});
button.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "toggleScript" }, function (response) {
        updateButton(response.scriptEnabled);
    });
});

// Функция для обновления стиля кнопки
function updateButton(scriptEnabled) {
    button.className = `${scriptEnabled ? 'enabled' : ''}`
    button.textContent = `${scriptEnabled ? "Выключить" : 'Включить'}`;
}
