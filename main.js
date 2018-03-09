
const readline = require('readline');

const {log, biglog, errorlog, colorize} = require("./out");

const cmds= require("./cmds");

// Mensaje inicial
biglog('CORE Quiz', 'green');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: colorize("quiz > ", 'blue'),
    completer: (line) => {
    const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
    const hits = completions.filter((c) => c.startsWith(line));
    // show all completions if none found
    return [hits.length ? hits : completions, line];
}
});

rl.prompt();

rl.
on('line', (line) => {
    let args = line.split(" ");
    let cmd = args[0].toLowerCase().trim();


    switch (cmd) {
        case '':
            rl.prompt();
            break;

        case 'h':
        case 'help':
            cmds.helpCmd(rl);
            break;

        case 'quit':
        case 'q':
            cmds.quitCmd(rl);
            break;

        case 'add':
            cmds.addCmd(rl);
            break;

        case 'list':
            cmds.listCmd(rl);
            break;

        case 'show':
            cmds.showCmd(rl, args[1]);
            break;

        case 'test':
            cmds.testCmd(rl, args[1]);
            break;

        case 'play':
        case 'p':
            cmds.playCmd(rl);
            break;

        case 'delete':
            cmds.deleteCmd(rl, args[1]);
            break;

        case 'edit':
            cmds.editCmd(rl, args[1]);
            break;

        case 'credits':
            cmds.creditsCmd(rl);
            break;

default:
    log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
    log(`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
    rl.prompt();
    break;
    }
})
.on('close', () => {
    log('Adios!');
    process.exit(0);
});



const helpCmd = () => {
    log("Comandos:");
    log("   h|help - Muestra esta ayuda.");
    log("   list - Listar los quizzes existentes.");
    log("   show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log("   add - Añadir un nuevo quiz interactivamente.");
    log("   delete <id> - Borrar el quiz indicado.");
    log("   edit <id> - Editar el quiz indicado.");
    log("   test <id> - Probar el quiz indicado.");
    log("   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("   credits - Créditos.");
    log("   q|quit - Salir del programa.");
    rl.prompt();
};

const listCmd = () => {
    log('Listar todos los quizzes existentes.', 'red');
    rl.prompt();
};

const showCmd = id => {
    log('Mostrar el quiz indicado.', 'red');
    rl.prompt();
};

const addCmd = () => {
    log('Añadir un nuevo quiz.', 'red');
    rl.prompt();
};

const deleteCmd = id => {
    log('Borrar el quiz indicado.', 'red');
    rl.prompt();

};
/**
 * Edita un quiz del modelo
 *
 * @param id Clave del quiz a editar en el modelo
 */
const editCmd = id => {
    log('Editar el quiz indicado.', 'red');
    rl.prompt();
};

const testCmd = id => {
    log('Probar el quiz indicado.', 'red');
    rl.prompt();
};

const playCmd = () => {
    log('Jugar.', 'red');
    rl.prompt();
};

const creditsCmd = () => {
    log('Autores de la práctica:');
    log('Claudia Novoa', 'green');
    log('Manuel Naharro', 'green');
    rl.prompt();
};

const quitCmd = () => {
    rl.close();
    rl.prompt();
};