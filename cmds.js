

const {log, biglog, errorlog, colorize} = require("./out");

const model=require('./model');

exports.helpCmd = rl => {
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

exports.listCmd = rl => {

    model.getAll().forEach((quiz, id) => {
        log(`   [${colorize(id, 'magenta')}]: ${quiz.question}`);
    });


    rl.prompt();
};

exports.showCmd = (rl, id) => {

    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
    }else{
        try{
            const quiz = model.getByIndex(id);
            log(`   [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch(error){
            errorlog(error.message);
        }
    }
    rl.prompt();
};
// importante es dificil
exports.addCmd = rl => {
    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
            rl.prompt();
        });
    });

};

exports.deleteCmd = (rl, id) => {

    if(typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
    }else{
        try{
            model.deleteByIndex(id);

        } catch(error){
            errorlog(error.message);
        }
    }


    rl.prompt();

};
/**
 * Edita un quiz del modelo
 *
 * @param id Clave del quiz a editar en el modelo
 */
exports.editCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
            try{
                const quiz = model.getByIndex(id);

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
                    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
                    rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
                        model.update(id, question, answer);
                        log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
                        rl.prompt();

                });
            });

        }catch (error){
            errorlog(error.message);
            rl.prompt();
        }
    }

};

exports.testCmd = (rl, id) => {
    if (typeof id == "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize(`${quiz.question}? `,'red'), ans=> {
                if( ans.toLowerCase().trim() === (quiz.answer.toLowerCase().trim())){
                    log('Su respuesta es correcta.');
                    biglog('Correcta', 'green');
            } else{
                    log('Su respuesta es incorrecta.');
                    biglog('Incorrecta','red');
            }
            rl.prompt();
            });


        } catch (error){
            errorlog(error.message);
            rl.prompt();
        }
    }
    rl.prompt();
};

exports.playCmd = rl => {

    let score = 0;
    let toBeResolved =[];

    for (let i = 0; i < model.count(); i++ ){
        toBeResolved[i]=i;
    }
     const playOne = () => {

        if(toBeResolved.length === 0){
            log('No hay nada más que preguntar.', 'red');
            log(`Fin del juego. Aciertos: ${score}`);
            biglog(`${score}`, 'pink');
            rl.prompt();
        } else{
            let id = Math.floor(Math.random()* toBeResolved.length);
            let quiz = model.getByIndex(toBeResolved[id]);
            toBeResolved.splice(id, 1);

            rl.question(colorize(`${quiz.question}?:`,'red'), ans => {
                if(ans.toLowerCase().trim() === (quiz.answer.toLowerCase().trim())){

                    score++;
                    log(`CORRECTO - Lleva ${score} aciertos`, 'magenta');
                    playOne();

            }else {
                    log( `INCORRECTO` , 'magenta');
                    log( `Fin del juego. Aciertos : ${score}`);
                    biglog(`${score}`, 'red');

            }
            rl.prompt();
            });
        }
    };
 playOne();
 rl.prompt();

};









exports.creditsCmd = rl => {
    log('Autores de la práctica:');
    log('Claudia Novoa', 'green');
    log('Manuel Naharro', 'green');
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
    rl.prompt();
};