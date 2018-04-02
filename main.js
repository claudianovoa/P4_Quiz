
const readline = require('readline');

const {log, biglog, errorlog, colorize} = require("./out");

const cmds= require("./cmds");

 const net= require("net");

 net.createServer(socket => {

     console.log("Se ha conectado un cliente desde" + socket.remoteAddress);
     // Mensaje inicial
     biglog(socket,'CORE Quiz', 'green');

     const rl = readline.createInterface({
         input: socket,
         output: socket,
         prompt: colorize("quiz > ", 'blue'),
         completer: (line) => {
             const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
             const hits = completions.filter((c) => c.startsWith(line));
             // show all completions if none found
             return [hits.length ? hits : completions, line];
         }
     });

     socket
         .on("end", () => { rl.close();})
         .on("error", () => { rl.close();});

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
                 cmds.helpCmd(socket,rl);
                 break;

             case 'quit':
             case 'q':
                 cmds.quitCmd(socket,rl);
                 break;

             case 'add':
                 cmds.addCmd(socket,rl);
                 break;

             case 'list':
                 cmds.listCmd(socket,rl);
                 break;

             case 'show':
                 cmds.showCmd(socket,rl, args[1]);
                 break;

             case 'test':
                 cmds.testCmd(socket,rl, args[1]);
                 break;

             case 'play':
             case 'p':
                 cmds.playCmd(socket,rl);
                 break;

             case 'delete':
                 cmds.deleteCmd(socket,rl, args[1]);
                 break;

             case 'edit':
                 cmds.editCmd(socket,rl, args[1]);
                 break;

             case 'credits':
                 cmds.creditsCmd(socket,rl);
                 break;

             default:
                 log(socket,`Comando desconocido: '${colorize(cmd, 'red')}'`);
                 log(socket,`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
                 rl.prompt();
                 break;
         }
     })
         .on('close', () => {
             log(socket,'Adios!');
             //process.exit(0);
         });


 })
 .listen(3030);




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