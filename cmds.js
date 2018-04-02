const Sequelize = require ('sequelize');

const {log, biglog, errorlog, colorize} = require("./out");

const {models}=require('./model');

exports.helpCmd = (socket,rl) => {
    log(socket,"Comandos:");
    log(socket,"   h|help - Muestra esta ayuda.");
    log(socket,"   list - Listar los quizzes existentes.");
    log(socket,"   show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
    log(socket,"   add - Añadir un nuevo quiz interactivamente.");
    log(socket,"   delete <id> - Borrar el quiz indicado.");
    log(socket,"   edit <id> - Editar el quiz indicado.");
    log(socket,"   test <id> - Probar el quiz indicado.");
    log(socket,"   p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log(socket,"   credits - Créditos.");
    log(socket,"   q|quit - Salir del programa.");
    rl.prompt();
};

exports.listCmd = (socket,rl) => {

    models.quiz.findAll()
        .each(quiz => {
                log(socket,` [${colorize(quiz.id, 'magenta')}]:  ${quiz.question}`);
    })
.catch(error => {
    errorlog(socket,error.message);
})
.then (() => {
    rl.prompt();
});


};

const makeQuestion = (rl, text) => {
    return new Sequelize.Promise((resolve, reject) => {
        rl.question(colorize(text, 'red'), answer => {
            resolve(answer.trim());
    });
    });
};

const validateId = id => {
    return new Sequelize.Promise(( resolve, reject) => {
        if (typeof id === "undefined") {
            reject(new Error (`Falta el parametro <id>.`));
    }else {
            id = parseInt (id);
            if (Number.isNaN(id)) {
                reject ( new Error (`Falta el parametro <id> no es un numero.`));
            } else {
                resolve(id);
            }
    }
    });
};

exports.showCmd = (socket,rl, id) => {
validateId(id)
    .then(id => models.quiz.findById(id))
    .then(quiz => {
        if (!quiz) {
            throw new Error(`No existe un quiz asociado al id=${id}.`);
    }
    log(socket,` [${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize( '=>', 'magenta')} ${quiz.answer} `);
    })
    .catch(error => {
        errorlog(socket,error.message);
    })
    .then(() => {
        rl.prompt();
    });
};
// importante es dificil
exports.addCmd = (socket,rl) => {
    makeQuestion(rl, ' Introduzca una pregunta: ')
        .then(q => {
            return makeQuestion(rl, ' Introduzca la respuesta ')
                .then(a => {
                    return {question: q, answer: a};
                });
        })
        .then(quiz => {
            return models.quiz.create(quiz);
        })
        .then((quiz) => {
            log(socket, `   [${colorize('Se ha añadido', 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog(socket, 'El quiz es erróneo:');
            error.errors.forEach(({message}) => errorlog(socket, message));
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

exports.deleteCmd = (socket,rl, id) => {

    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(socket,error.message);
    })
        .then(() => {
            rl.prompt();
    });
};
/**
 * Edita un quiz del modelo
 *
 * @param id Clave del quiz a editar en el modelo
 */
exports.editCmd = (socket,rl, id) => {
 validateId(id)
     .then(id => models.quiz.findById(id))
    .then(quiz => {
        if(!quiz) {
            throw new Error(`No existe un quiz asociado al id=${id}.`);
    }
    process.stdout.isTTY && setTimeout (() => {rl.write(quiz.question)}, 0);
    return makeQuestion(rl, 'Introduzca la pregunta: ')
        .then(q => {
            process.stdout.isTTY && setTimeout (() => {rl.write(quiz.answer)}, 0);
            return makeQuestion(rl, 'Introduzca la respuesta:')
                .then(a => {
                    quiz.question = q;
                    quiz.answer = a;
                    return quiz;
            });
    });
    })
.then(quiz => {
    return quiz.save();
    })
.then (quiz => {
        log(socket,` Se ha cambiado el quiz ${colorize(quiz.id, 'magenta')} por:  ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
    })
.catch(Sequelize.ValidationError, error => {
        errorlog(socket,'El quiz es erroneo:');
    error.errors.forEach(({message}) => errorlog(socket,message));
})
.catch(error => {
        errorlog(socket,error.message);
})
.then (() => {
        rl.prompt();
});
};

exports.testCmd = (socket,rl, id) =>
{ validateId(id)
    .then(id => models.quiz.findById(id))
    .then(quiz => {
        if (!quiz) {
            throw new Error(`No existe un quiz asociado al id=${id}.`);
        }

        log(socket, ` [${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
        return makeQuestion(rl, ' Introduzca la respuesta ')
            .then(a => {
                switch(a.toLowerCase().trim()){
                    case quiz.answer.toLowerCase().trim():
                        log(socket, 'Su respuesta es correcta.');
                        biglog(socket, 'CORRECTO','green');
                        break;
                    default:
                        log(socket, 'Su respuesta es incorrecta.');
                        biglog(socket, 'INCORRECTO','red');
                        break;
                }
            });
    })
    .catch(error => {
        errorlog(socket, error.message);
    })
    .then(() => {
        rl.prompt();
    });
};

exports.playCmd = (socket,rl) => {

    let score = 0;
    let toBeResolved =[];


     const playOne = () => {
         return Sequelize.Promise.resolve()
             .then(() => {
                 if (toBeResolved.length <= 0) {
                     log(socket, 'No hay nada más que preguntar.', 'red');
                     log(socket, `Fin del juego. Aciertos: ${score}`);
                     biglog(socket, `${score}`, 'pink');
                     return;
                 }


                 let id = Math.floor(Math.random() * toBeResolved.length);
                 let quiz = toBeResolved[id];
                 toBeResolved.splice(id, 1);

                 return makeQuestion(rl, `${quiz.question}?`)
                     .then(a => {
                         switch (a.toLowerCase().trim()) {
                             case quiz.answer.toLowerCase().trim():
                                 score++;
                                 log(socket, `CORRECTO - Lleva ${score} aciertos`, 'magenta');
                                 resolve(playOne());
                                 break;

                             default:
                                 log(socket, `INCORRECTO`, 'magenta');
                                 log(socket, `Fin del juego. Aciertos : ${score}`);
                                 biglog(socket, `${score}`, 'red');
                                 resolve();
                                 break;


                         }
                     });
             });
     };

    models.quiz.findAll({raw: true})
        .then(quizzes => {
        toBeResolved = quizzes;
})
.then(() => {
        return playOne();
})
.catch(error => {
        console.log(socket,error);
})
.then(() => {

    rl.prompt();
});
};







exports.creditsCmd = (socket,rl) => {
    log(socket,'Autores de la práctica:');
    log(socket,'Claudia Novoa', 'green');
    log(socket,'Manuel Naharro', 'green');
    rl.prompt();
};

exports.quitCmd = (socket,rl) => {
    rl.close();
    socket.end();
};