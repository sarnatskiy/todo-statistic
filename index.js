const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

const TODOs = [];

console.log('Please, write your command!');
parseAllTODO(getFiles)
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

function parseAllTODO(file){
    const TODOs = [];
    const lines = file.split("\n");

    for (const line of lines){
        if (line.include("// TODO")){
            TODOs.push(line.trim());
        }
    }
    return TODOs
}

function writeTODOS(TODOs){
    for (const todo of TODOs){
        console.log(todo);
    }
}
// TODO you can do it!
