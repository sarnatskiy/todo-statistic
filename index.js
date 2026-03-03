const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
const TODOs = parseAllTODO(files)
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            writeTODOS(TODOs);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function parseAllTODO(files){
    const TODOs = [];
    for (const file of files){
        const lines = file.split("\n");

        for (const line of lines){

            const todoMatch = line.match(/\/\/\s*TODO\s*(.+)/i);
            
            if (todoMatch) {
        
                const todoText = todoMatch[0].trim();
                
                TODOs.push({
                    fullLine: line.trim(),           // полная строка
                    text: todoText,                   // только текст TODO
                    //user: extractUser(todoText),      // автор (если есть)
                    //date: extractDate(todoText),      // дата (если есть)
                    //priority: countExclamations(todoText) // количество !
                });
            }
        }
    }  
    return TODOs
}

function writeTODOS(TODOs){
    for (const todo of TODOs){
        console.log(todo.text);
    }
}
// TODO you can do it!
