const imgMsg = document.querySelector('.original h2');
const imgMsgText = 'Original image';

const resultMsg = document.querySelector('.result h2');
const resultMsgText = 'HTML output';

const img = document.querySelector('.original img');
const resultContainer = document.querySelector('.result .container')
const drawBtn = document.getElementById('draw-btn');

const urlInput = document.querySelector('[name="imageUrl"]');
const fileInput = document.querySelector('[name="imageFile"]');
const reader = new FileReader();
const HTMLreader = new FileReader();

let canvas, ctx;

img.addEventListener('error', () => {
    toggleAllLoadingMessages(false);

    window.alert('Invalid image (or CORS related problem)');
})

img.addEventListener('load', () => {
    toggleLoadingMessage(imgMsg, imgMsgText);

    if (canvas || ctx) { // if canvas is created (not first drawing), reset output
        resultContainer.innerHTML = '';
        updateCanvasSize(img.clientWidth, img.clientHeight);
    } else { // else create a canvas
        initCanvas();
    }

    resultContainer.style.width = img.clientWidth - 1 + 'px';
    resultContainer.style.height = img.clientHeight - 1 + 'px';

    draw();
})

urlInput.addEventListener('input', toggleClearInputButton)
fileInput.addEventListener('input', toggleClearInputButton)

reader.addEventListener('load', (e) => {
    const res = e.target.result;
    console.log('loaded local image');
    img.src = res;
})

HTMLreader.addEventListener('load', (e) => {
    const res = e.target.result;
    console.log('loaded local html file');

    const link = document.createElement('a');
    link.setAttribute('download', 'div_pixels')
    link.setAttribute('target', '_blank')
    link.href = res;
    link.click();
})

drawBtn.addEventListener('click', () => {
    urlInput.value = urlInput.value.trim();

    toggleAllLoadingMessages(true);

    if (fileInput.value) {
        reader.readAsDataURL(fileInput.files[0]);
    } else if (urlInput.value) {
        img.src = urlInput.value;
    } else {
        toggleAllLoadingMessages(false);
        window.alert('Provide image URL or file');
    }

    clearInputs();
})

function initCanvas() {
    canvas = document.createElement('canvas');
    updateCanvasSize();

    ctx = canvas.getContext('2d');
}

function updateCanvasSize(width = img.clientWidth, height = img.clientHeight) {
    // clear old image
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // resize
    canvas.width = width;
    canvas.height = height;
}

function draw() {
    // draw image on canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // pick color from every pixel of canvas and add a div with that color for background to pixels (HTML string)
    let data, pixels = '';
    for (let y = 1; y <= resultContainer.clientHeight; y++) {
        for (let x = 1; x <= resultContainer.clientWidth; x++) {
            data = ctx.getImageData(x, y, 1, 1).data;

            pixels += pixelPattern(data);
        }
    }

    resultContainer.innerHTML = pixels;

    toggleLoadingMessage(resultMsg, resultMsgText);

    showActionButtons();
}

function createElements(...data) {
    /*  element model:
    {
        type: string // tagname
        id?: string, // HTML element id
        textContent?: string, // any attributes
        onclick?: function() // events
        parent?: HTMLElement, // parent to append the element to
        // any other attribute
    }   */
    const elements = [];
    for (const obj of data) {
        let el;

        for (const pair of Object.entries(obj)) {
            const [key, value] = pair;

            if (key === 'type') { // initialize element
                el = document.createElement(value);
            }

            else if (key === 'id') { // remove other element (if such) with given id
                let otherEl = document.getElementById(value);
                if (otherEl) {
                    otherEl.remove();
                }
            }

            if (el) { // in case 'type' is not given as first pair 
                if (key === 'parent') {
                    value.appendChild(el);
                } else { // normal case handling setting attributes
                    el[key] = value;
                }
            } else {
                console.error('Element must have valid type')
            }
        }

        elements.push(el);
    }

    return elements; // returns elements instances
}

function showActionButtons() {
    const containerEl = createElements({
        type: 'article',
        id: 'output-action',
        className: 'action-buttons',
        parent: document.querySelector('body')
    })[0];


    const data = [
        {
            type: 'button',
            id: 'downloadBtn',
            textContent: 'Download HTML file',
            onclick: downloadOutput,
            parent: containerEl
        },
        {
            type: 'button',
            id: 'copyBtn',
            textContent: 'Copy HTML to clipboard',
            onclick: copyToClipboard,
            parent: containerEl
        }
    ]

    createElements(...data)
}
function downloadOutput() {
    let doc = document.implementation.createHTMLDocument();

    doc.head.innerHTML = headPattern(resultContainer);

    doc.body.innerHTML = resultContainer.innerHTML;

    // console.log(doc.);
    const f = new File(doc.all, 'a.html', {
        type: 'text/html',
        extension: '.html'
    })

    console.log(f)

    HTMLreader.readAsDataURL(f);
}
function copyToClipboard() {
    navigator.clipboard.writeText(outputPattern(resultContainer))
        .then(() => console.log('copied to clipboard'),
            () => window.alert('Coulndn\'t copy HTML output to clipboard'))
}

function clearInputs() {
    fileInput.value = '';
    urlInput.value = '';
}

function toggleClearInputButton() {
    const buttonEl = document.getElementById('clear-input-btn');

    if ((urlInput.value || fileInput.value)) {
        if (buttonEl) // check if button already exists 
            return;

        createElements({
            type: 'button',
            id: 'clear-input-btn',
            onclick: (e) => {
                clearInputs();
                e.target.remove();
            },
            textContent: 'Clear inputs',
            parent: document.getElementById('input-action')
        })
    } else {
        buttonEl.remove();
    }
}

function toggleLoadingMessage(element, msg) {
    const loadingMsg = 'Loading...';
    if (msg) {
        element.textContent = msg;
    } else {
        element.textContent = loadingMsg;
    }
}

function toggleAllLoadingMessages(isLoading = false) {
    if (isLoading) {
        toggleLoadingMessage(imgMsg);
        toggleLoadingMessage(resultMsg);
    } else {
        toggleLoadingMessage(imgMsg, imgMsgText);
        toggleLoadingMessage(resultMsg, resultMsgText);
    }
}