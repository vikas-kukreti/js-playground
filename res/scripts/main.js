const fileMenu = document.querySelector('.file-pane');
const codeEditor = document.querySelector('#editor');
const codeOutput = document.querySelector('#output');
const resizeHandle = document.querySelector('#resizer');
let currentFile = '';
let modified = false;

const editor = CodeMirror(codeEditor, {
    value: "// write some js code here\n// press ctrl + s to save \n// to run press ctrl + enter \n// or click on output box\n",
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
    if(!modified && editor.getValue() != localStorage.getItem(currentFile)) {
        if(fileMenu.querySelector('.current')) {
            modified = true;
            fileMenu.querySelector('.current').classList.add('modified');
        }
    }
});


resizeHandle.addEventListener('mousedown', initDrag, false);

function executeCode()  {
    const document = undefined;
    const window = undefined;
    const location = undefined;
    const vikas = vex.dialog;
    "use strict";
    let output = '';
    const setInterval = function(x,y) {
        console.log("setInterval is not supported!")
    }
    const setTimeout = function(x,y) {
        console.log("setTimeout is not supported!")
    }
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
        if(e.lineNumber == undefined)
            e.lineNumber = e.stack.split('>:')[1].split(':')[0];
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
    codeOutput.style.width = (startWidth - e.clientX + startX) + 'px';
}

function stopDrag(e) {
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}

document.addEventListener('keydown', (e) => {
    if (e.keyCode == 83 && e.ctrlKey) {
        e.preventDefault();
        if(!currentFile) {
            createFile(true);
        } else {
            localStorage.setItem(currentFile, editor.getValue());
            modified = false;
            refreshFileMenu();
        }
    }
});

function createFile(save) {
    vex.dialog.prompt({
        message: 'Provide file name',
        placeholder: 'File name',
        callback: function (value) {
            if(!value) {
                vex.dialog.alert("Empty file name provided!")
                return;

            }
            else if(value.indexOf(',') > -1) {
                vex.dialog.alert("You cannot use special characters in file name!");
                return;
            }
                
            let files = localStorage.getItem('files');
            if(files)
                files = files.split(',');
            else
                files = []
            if(files.indexOf(value) > -1) {
                vex.dialog.alert("This name is already in use!");
                return;
            }
                
            currentFile = value;
            files.push(currentFile);
            localStorage.setItem('files', files);
            if(save) {
                localStorage.setItem(currentFile, editor.getValue());
            } else {
                localStorage.setItem(currentFile, '// ' + currentFile +': write some code');
                editor.setValue( '// ' + currentFile +': write some code');
            }
            refreshFileMenu();
        }
    });
}


function refreshFileMenu() {
    fileMenu.querySelector('.files').innerHTML = '';
    if(files = localStorage.getItem('files')) {
        files = files.split(',');
        files.forEach(file => {
            const fileItem = document.createElement('li');
            fileItem.innerText += file;
            if(file == currentFile) {
                fileItem.className = 'current';
            }
            fileItem.setAttribute('data-file', file);
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete';
            deleteBtn.textContent = 'X';
            fileItem.appendChild(deleteBtn);
            fileMenu.querySelector('.files').appendChild(fileItem);
            fileItem.addEventListener('click', (e) => {
                if(e.target != fileItem)
                    return;
                currentFile = fileItem.getAttribute('data-file');
                const textContent = localStorage.getItem(currentFile) || '// write some code';
                editor.setValue(textContent);
                refreshFileMenu();
            });
            deleteBtn.addEventListener('click', ()=>{
                vex.dialog.confirm({
                    message: 'Are you sure you want to delete ' + fileItem.getAttribute('data-file') + '?',
                    callback: function (value) {
                        if (value) {
                            const index = files.indexOf(fileItem.getAttribute('data-file'));
                            if (index > -1) {
                                editor.setValue('// write some code');
                                files.splice(index, 1);
                                localStorage.setItem('files', files);
                                localStorage.removeItem(fileItem.getAttribute('data-file'))
                                currentFile = '';
                                refreshFileMenu();
                            }
                        }
                    }
                });
            });
        });
    }
    editor.focus();
    
}

refreshFileMenu();