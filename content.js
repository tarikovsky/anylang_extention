let active = false;
const plusImg = chrome.runtime.getURL(`public/img/add.svg`);
const questionImg = chrome.runtime.getURL(`public/img/question.svg`);
const volumeImg = chrome.runtime.getURL(`public/img/volume.svg`);


async function translation(text) {
    try {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        })
        return `Перевод: ${text}`
    } catch (error) {
        throw error;
    }
}

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

function render(tag, text) {
    children = document.getElementById(tag);
    children.textContent = text;
    console.log(text)
}


async function instantTranslate(e) {
    let text;
    text = e.target.textContent;
    if (text && active) {
        removeExistingTooltip(); // Удаляет существующий tooltip, если он есть
        let tooltip;
        tooltip = createTooltip(text);
        document.body.appendChild(tooltip);

        let rect = e.target.getBoundingClientRect();
        if (window.innerHeight - rect.top > rect.bottom) {
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        }
        else {
            tooltip.style.bottom = `${-rect.top - window.scrollY + 5 + window.innerHeight}px`;
        }
        if (window.innerWidth - rect.left > rect.right) {
            tooltip.style.left = `${rect.left + window.scrollX}px`;
        }
        else {
            tooltip.style.right = `${-rect.right - window.scrollX + window.innerWidth - 18}px`;
        }
        tooltip.style.width = `${rect.width - 40}px`
        tooltip.style.minWidth = '200px'


        render('translatedtText', 'Загрузка...');
        await translation(text)
            .then(res => {
                render('translatedtText', res);
                // console.log(res);
            })
            .catch(error => {
                render('translatedtText', 'Ошибка!');
                // console.log(error);
            })
    }
};


function createTooltip(text) {

    let tooltip = document.createElement('div');

    let top = document.createElement('div');
    let translatedText = document.createElement('p');

    let originalText = document.createElement('h1');
    let buttonsDiv = document.createElement('div');

    let plus = document.createElement('img');
    let question = document.createElement('img');
    let sound = document.createElement('img');

    tooltip.appendChild(top);
    tooltip.appendChild(translatedText);

    top.appendChild(originalText);
    top.appendChild(buttonsDiv);


    buttonsDiv.appendChild(plus);
    buttonsDiv.appendChild(question);
    buttonsDiv.appendChild(sound);

    tooltip.setAttribute('id', 'customTooltip');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltip.style.padding = '20px';
    tooltip.style.zIndex = '1000';
    tooltip.style.color = "white";

    let currentAngle = -20;
    const targetAngle = 0; // Угол, до которого нужно повернуть элемент
    const speed = 1; // Скорость поворота в градусах за кадр

    function rotate() {
        if (currentAngle < targetAngle) {
            currentAngle += speed;
            tooltip.style.transform = `rotate(${currentAngle}deg)`;

            // Запрос следующего кадра анимации
            requestAnimationFrame(rotate);
        }
    }

    rotate();
    top.setAttribute('id', 'top');
    top.style.display = 'flex';
    top.style.borderBottom = "1px solid white"
    top.style.paddingBottom = "10px";
    top.style.gap = '20px';

    buttonsDiv.setAttribute('id', 'buttonsDiv');
    buttonsDiv.style.width = '60px';
    buttonsDiv.style.height = '15px';
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.justifyContent = 'space-between';
    buttonsDiv.style.alignItems = 'start';
    buttonsDiv.style.marginTop = '0px'

    originalText.textContent = text;
    originalText.style.width = 'calc(100% - 80px)'
    originalText.style.color = "white";
    originalText.style.fontSize = "17px";
    originalText.style.padding = "0";
    originalText.style.margin = "0";

    translatedText.setAttribute('id', 'translatedtText');
    translatedText.style.textAlign = "left";
    translatedText.style.color = "white";
    translatedText.style.fontSize = "15px";
    translatedText.style.padding = "0";
    translatedText.style.margin = "0";
    translatedText.style.marginTop = "10px";

    plus.src = plusImg;
    plus.style.width = '20px';
    plus.style.height = '20px';
    plus.style.cursor = 'pointer';
    plus.addEventListener('mouseover', (e) => {
        plus.style.opacity = '0.7'
    })
    plus.addEventListener('mouseout', (e) => {
        plus.style.opacity = '1'
    })

    question.src = questionImg;
    question.style.width = '20px';
    question.style.height = '20px';
    question.style.cursor = 'pointer';
    question.addEventListener('mouseover', (e) => {
        question.style.opacity = '0.7'
    })
    question.addEventListener('mouseout', (e) => {
        question.style.opacity = '1'
    })

    sound.src = volumeImg;
    sound.style.width = '20px';
    sound.style.height = '20px';
    sound.style.cursor = 'pointer';
    sound.addEventListener('mouseover', (e) => {
        sound.style.opacity = '0.7'
    })
    sound.addEventListener('mouseout', (e) => {
        sound.style.opacity = '1'
    })

    return tooltip;
}

function removeExistingTooltip() {
    let existingTooltip = document.getElementById('customTooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}
document.addEventListener('click', function (event) {
    let tooltip = document.getElementById('customTooltip');
    let text = document.querySelector('.checked');
    let targetElement = event.target; // Кликнутый элемент
    if (!(tooltip && tooltip.contains(targetElement)) && !(text && text.contains(targetElement))) {
        console.log('delete');
        removeExistingTooltip();
    }
})


// Функция для добавления выделения
function highlightWord(event) {
    if (active && event) {
        event.target.classList.add('checked');
        event.target.style.backgroundColor = '#FFB57C';
    }
}

// Функция для снятия выделения
function unhighlightWord(event) {
    if (active && event) {
        event.target.classList.remove('checked');
        event.target.style.backgroundColor = '';
    }
}
const tags = ['p', 'h1', 'h2', 'h3', 'h4']
const splitSenteses = ['.', '?', '!']

tags.map((tag) => {
    document.querySelectorAll(tag).forEach(p => {
        let words = p.textContent.split(' ').map(word => {
            return `<w>${word}</w>`;
        }).join(' ');


        splitSenteses.map((splitSentense) => {
            words = words.split(splitSentense).map(se => {
                return `<se>${se}</se>`;
            }).join(splitSentense);
        })

        p.innerHTML = words;
    });
})


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

// tags.map((tag) => {
//     document.querySelectorAll(tag).forEach(p => {
//         p.style.userSelect = '#FFB57C';
//         p.addEventListener("mouseup", handleTextSelection);
//     });
// })

// function handleTextSelection() {
//     if (window.getSelection) {
//         var selection = window.getSelection();
//         range = selection.getRangeAt(0);
//         selectedElement = range.commonAncestorContainer;

//         if (selectedElement.nodeType === 3) {
//             selectedElement = selectedElement.parentNode;
//         }
//         text = selectedElement.textContent;
//         if (selectedElement.textContent.trim() !== '') {
//             instantTranslate(selectedElement);
//             highlightWord(selectedElement)
//         }
//     }
// }

