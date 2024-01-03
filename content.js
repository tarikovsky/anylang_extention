let active = false;

chrome.runtime.sendMessage({ action: "queryStatus" }, function (response) {
    if (response.scriptEnabled) {
        // Логика, если скрипт включен
        active = true;
        console.log("Скрипт активирован в content.js");
    } else {
        active = false;
        // Логика, если скрипт выключен
        console.log("Скрипт деактивирован в content.js");
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "scriptStatus") {
        if (request.status) {
            // Логика, если скрипт включен
            active = true;
            console.log("Скрипт активирован в content.js");
        } else {
            active = false;
            // Логика, если скрипт выключен
            console.log("Скрипт деактивирован в content.js");
        }
    }
});
function instantTranslate(e) {
    setTimeout(() => {

        if (e.target.textContent && active) {
            removeExistingTooltip(); // Удаляет существующий tooltip, если он есть

            let tooltip = createTooltip(e.target.textContent);
            document.body.appendChild(tooltip);

            // Позиционирование tooltip
            let rect = e.target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`; // 5px ниже конца выделения
        }
    }, 10)
};

function createTooltip(text) {

    let tooltip = document.createElement('div');
    tooltip.setAttribute('id', 'customTooltip');
    tooltip.style.position = 'absolute';
    tooltip.style.border = '1px solid black';
    tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.padding = '20px';
    tooltip.style.zIndex = '1000';
    tooltip.style.color = "white";

    // Создание внутреннего div и h1
    let innerDiv = document.createElement('div');
    let header = document.createElement('h1');
    header.textContent = text;
    header.style.color = "white";
    header.style.fontSize = "17px";
    header.style.padding = "0";
    header.style.paddingBottom = "10px";
    header.style.borderBottom = "1px solid white"
    header.style.margin = "0";
    innerDiv.appendChild(header);

    // Добавление пользовательского текста
    let textContent = document.createElement('p');
    textContent.textContent = "Перевод: " + text;
    textContent.style.textAlign = "left";
    textContent.style.color = "white";
    textContent.style.fontSize = "15px";
    textContent.style.padding = "0";
    textContent.style.margin = "0";
    textContent.style.marginTop = "10px";
    innerDiv.appendChild(textContent);

    tooltip.appendChild(innerDiv);
    return tooltip;
}

function removeExistingTooltip() {
    let existingTooltip = document.getElementById('customTooltip'); // Используйте идентификатор для поиска tooltip
    if (existingTooltip) {
        existingTooltip.remove();
    }
}
document.addEventListener('click', function (event) {
    let tooltip = document.getElementById('customTooltip');
    let targetElement = event.target; // Кликнутый элемент

    // Проверяем, что tooltip существует и клик произошел вне его
    if (tooltip && !tooltip.contains(targetElement)) {
        removeExistingTooltip();
    }
});
document.querySelectorAll('p').forEach(p => {

    let words = p.textContent.split(' ').map(word => {
        return `<w>${word}</w>`;
    }).join(' ');


    let sentenses = words.split('.').map(se => {
        return `<se>${se}</se>`;
    }).join('.');


    p.innerHTML = sentenses;
});

// Функция для добавления выделения
function highlightWord(event) {
    if (active)
        event.target.style.backgroundColor = '#FFB57C';
}

// Функция для снятия выделения
function unhighlightWord(event) {
    if (active)
        event.target.style.backgroundColor = '';
}

// Добавляем обработчики событий к каждому слову
document.querySelectorAll('w').forEach(word => {
    word.addEventListener('mouseover', highlightWord);
    word.addEventListener('mouseout', unhighlightWord);
    word.addEventListener('click', instantTranslate);
});

document.querySelectorAll('se').forEach(se => {
    se.addEventListener('mouseover', highlightWord);
    se.addEventListener('mouseout', unhighlightWord);
    se.addEventListener('click', instantTranslate);
});