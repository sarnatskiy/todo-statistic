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
    const parts = command.split(' ');
    const baseCommand = parts[0].toLowerCase();
    
    switch (baseCommand) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            writeTODOS(TODOs);
            break;
        case 'important':
            showImportant(TODOs);
            break;
        case 'user':
            if (parts.length < 2) {
                console.log('Please specify username: user {username}');
            } else {
                const username = parts.slice(1).join(' ');
                showUserTodos(TODOs, username);
            }
            break;
        case 'sort':
            if (parts.length < 2) {
                console.log('Please specify sort type: sort {importance | user | date}');
            } else {
                const sortType = parts[1].toLowerCase();
                sortAndShowTodos(TODOs, sortType);
            }
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
                const todoText = todoMatch[1].trim(); 
                
                const parsed = parseTodoFormat(todoText);
                
                TODOs.push({
                    fullLine: line.trim(),
                    text: todoMatch[0].trim(),
                    content: parsed.content,
                    user: parsed.user,
                    date: parsed.date,
                    priority: countExclamations(todoText) 
                });
            }
        }
    }  
    return TODOs
}

function parseTodoFormat(todoText) {
    const parts = todoText.split(';').map(part => part.trim());
    
    if (parts.length === 3) {
        return {
            user: parts[0],
            date: new Date(parts[1]),
            content: parts.slice(2).join('; ')
        };
    } else if (parts.length === 2) {
        return {
            user: parts[0],
            date: null,
            content: parts[1]
        };
    } else {
        return {
            user: null,
            date: null,
            content: todoText
        };
    }
}

function countExclamations(text) {
    return (text.match(/!/g) || []).length;
}

function writeTODOS(TODOs){
    for (const todo of TODOs){
        console.log(todo.text);
    }
}

function showImportant(TODOs) {
    const importantTodos = TODOs.filter(todo => todo.priority > 0);
    
    if (importantTodos.length === 0) {
        console.log('No important TODOs found (with !)');
    } else {
        for (const todo of importantTodos) {
            console.log(todo.text);
        }
    }
}

function showUserTodos(TODOs, username) {
    const userTodos = TODOs.filter(todo => 
        todo.user && todo.user.toLowerCase() === username.toLowerCase()
    );
    
    if (userTodos.length === 0) {
        console.log(`No TODOs found for user: ${username}`);
    } else {
        for (const todo of userTodos) {
            console.log(todo.text);
        }
    }
}

function sortAndShowTodos(TODOs, sortType) {
    let sortedTodos = [];
    
    switch (sortType) {
        case 'importance':
            sortedTodos = [...TODOs].sort((a, b) => b.priority - a.priority);
            console.log('TODOs sorted by importance:');
            break;
            
        case 'user':
            sortedTodos = [...TODOs].sort((a, b) => {
                if (a.user && !b.user) return -1;
                if (!a.user && b.user) return 1;
                if (a.user && b.user) {
                    return a.user.localeCompare(b.user);
                }
                return 0;
            });
            console.log('TODOs grouped by user:');
            break;
            
        case 'date':
            sortedTodos = [...TODOs].sort((a, b) => {
                if (a.date && !b.date) return -1;
                if (!a.date && b.date) return 1;
                if (a.date && b.date) {
                    return b.date - a.date;
                }
                return 0;
            });
            console.log('TODOs sorted by date:');
            break;
            
        default:
            console.log('Unknown sort type. Use: importance, user, or date');
            return;
    }
    
    for (const todo of sortedTodos) {
        console.log(todo.text);
    }
}

// TODO you can do it!