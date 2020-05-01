const codeEditor = document.querySelector('#editor');
const codeOutput = document.querySelector('#output');
const resizeHandle = document.querySelector('#resizer');


const editor = CodeMirror(codeEditor, {
    value: "// write some js code here\n// to run press ctrl + enter \n// or click on output box\n",
    lineNumbers: true,
    theme: "dracula",
    mode:  "javascript",
    scrollbarStyle: "null"
});

codeOutput.addEventListener('click', (e) => {
    codeOutput.innerHTML = '<h4 style="color: #55ff55">💨 Running ...</h4>';
    setTimeout(() => {
        executeCode();
    }, 1);
    
});

codeEditor.addEventListener('keydown', (e) => {
    if (event.ctrlKey && event.keyCode === 13) {
        codeOutput.click();
    }
});

resizeHandle.addEventListener('mousedown', initDrag, false);

function executeCode()  {
    let output = '';
    console.log = function(value) {
        if(typeof value == 'string')
            value = value.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        if(typeof value == 'object')
            value = '<pre>' + JSON.stringify(value, undefined, 2) + '</pre>';
        output += value + '<br/>';
    };
    const code = editor.getValue();
    if(code.trim() == '') {
        codeOutput.innerHTML = '<h4 style="color: #ff5555">🤣 First write some code, then run it!</h4>';
        return;
    }
    try {
        const startTime = new Date();
        const returnValue = eval(code);
        const endTime = new Date();
        const totalTime = endTime - startTime;
        codeOutput.innerHTML = output;
        codeOutput.innerHTML += '</br><h4 style="color: #55ff55">🚀 Execution took ' + totalTime + 'ms</h4>';
        codeOutput.innerHTML += '<h4 style="color: #55ff55">💻 Code Returned: <span style="color: #f0f0f0">' + returnValue + '</span></h4>';
        codeOutput.scrollTo(0,codeOutput.scrollHeight);
    } catch (e) {
        codeOutput.innerHTML = '<h4 style="color: #ffcc55">😢 Ohh No!</h4>';
        codeOutput.innerHTML += '<h4 style="color: #ff5555">' + e.name + ': <span style="color: #f0f0f0">' + e.message + '</span></h4>';
        if(typeof e.lineNumber != 'undefined')
            codeOutput.innerHTML += '<h4 style="color: #ff5555">Problem at line number: <span style="color: #f0f0f0">' + e.lineNumber + '</span></h4>';
    }
}

let startX, startWidth;
function initDrag(e) {
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(codeOutput).width, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function doDrag(e) {
    codeOutput.style.width = (startWidth - e.clientX + startX - 5) + 'px';
}

function stopDrag(e) {
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}