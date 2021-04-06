//https://attacomsian.com/blog/reading-a-file-line-by-line-in-nodejs
const fs = require('fs');

// vue dans le cours
const { randomInt } = require('crypto')

//https://www.npmjs.com/package/readline-sync
const readline = require('readline-sync')


// https://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
String.prototype.replaceAt = function(index, replacement) 
{
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

// function pour avoir le nombre de lettre dans un mot
function getOccurenceCharacter(character, word) 
{
    let count = 0;
    // on boucle ici pour parcourir le mot lettre par lettre et donc compter le nombre d'occurence d'un caractere présent dans le mot
    for (let i = 0; i < word.length; i++) {
        // SI la position de word[i] (prenons "coucou" comme word, et o comme character)
        if (word[i] === character) {
            // si l'occurence est trouver on incrémente la variable
            count++;
        }
    }
    // on retourne le nombre d'occurence a la fin de la fonction
    return (count);
}

function getIndexOf(character, word, position) 
{
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        if (word[i] === character) {
            count++;
            if (count === position) {
                return (i);
            }
        }
    }
    return (-1);
}

try {

    // je recupère toutes les lignes du fichier
    const data = fs.readFileSync('dict.txt', 'UTF-8');

    // je coupe ligne par ligne avec \r\n ou \n pour tout avoir dans un tableau
    const lines = data.split(/\r?\n/);

    // on genere un chiffre aléaoire pour avoir un mot dans la liste, selon le nombre de mot dans le dictionnaire
    const n = randomInt(0, lines.length);

    // on stock le mot choisi aléatoirement dans une variable
    const wordResult = lines[n];

    // on genere un chiffre aleatoire pour obtenir une lettre au hasard et l'afficher en premier pour aider le joueur
    const randomChar = randomInt(0, lines[n].length);

    // on déclare une variable avec le nombre de tentative pour gagner
    let tentative = 10;
    //console.log(`random words: ${wordResult}`)

    // on declare la variable ou sera afficher le mot qui doit etre trouver 
    var wordtoFind = "";

    // boucle qui permet de generer le mot a trouver avec les _ + une lettre au hasard (voir ligne 39)
    for (let i = 0; i < wordResult.length; i++)  {
        if (i !== randomChar) {
            wordtoFind += "_";
        } else {
            wordtoFind += wordResult[i];
        }
    }

    //on declare une variable de fin de condition de jeu*
    let isFinish = false;

    // on declare la boucle de jeu
    while (!isFinish) {

        console.log("Merci de trouver le mot... "  + tentative + " restant" );

        // on lit l'entrée utilisateur sur le terminal, afin d'avoir une lettre en minuscule
        let answer = readline.question(wordtoFind + "\n").toLowerCase();

        // si l'utilsiateur entre plus de deux lettre, on affiche une erreur pour lui dire qu'il faut entrer un caractere seulement
        if (answer.length >= 2) {
            console.log("la regle du jeu est simple, tu dois juste donner une lettre");
        // si lutilsiateur entre une lettre, on peut continuer
        } else if (answer.length === 1) {
            // si la lettre est cotenu dans le mot choisi aleatoirement, on continu
            if (wordResult.includes(answer)) {
                // si la lettre est déjà presente dans le mot, on enleve une tentative
                if (wordtoFind.includes(answer)) {
                    let result = getOccurenceCharacter(answer, wordResult);
                    if (result <= 1) {
                        tentative--;
                    } else {
                        for (let i = 1; i <= result; i++) {
                            // ici grace a la fonction getIndexOf je recupere l'index de la lettre (num = position) pour ensuite l'aficher sur le mot a trouver (i_______i___) infomatique
                            var num = getIndexOf(answer, wordResult, i);
                            //function replaceAt qui permet de replacer nottament le _ par la lettre trouvé !
                            wordtoFind = wordtoFind.replaceAt(num, answer);
                        }
                    }
                // si la lettre entré par l'utilsiateur est pas deja trouver, on l'affiche    
                } else {
                    // ici on recupere le nombre d'occurrence d'une lettre, exemple dans informatique on a 2 fois la lettre I ! donc ici la fonction getOccurenceCharacter renvoi 2
                    let result = getOccurenceCharacter(answer, wordResult);
                    console.log("result", result);
                    // on fait une boucle pour le nombre d'occurence de la lettre dans le mot
                    for (let i = 1; i <= result; i++) {
                        // ici grace a la fonction getIndexOf je recupere l'index de la lettre (num = position) pour ensuite l'aficher sur le mot a trouver (i_______i___) infomatique
                        var num = getIndexOf(answer, wordResult, i);
                        //function replaceAt qui permet de replacer nottament le _ par la lettre trouvé !
                        wordtoFind = wordtoFind.replaceAt(num, answer);
                    }
                }
            } else {
                tentative--;
            }
        }

        // si tentative arrive a 0 le jeu est terminer
        if (tentative === 0) {
            console.log("Partie terminé ...");
            break;
        // sinon si, si le mot a trouve ne contient plus de _ ça veut dire que tout est ok donc le jeu est terminer
        } else if (!wordtoFind.includes("_")) {
            console.log(wordtoFind + "\nBravo tu as gagné");
            break;
        }
    }

} catch (err) {
    console.error(err);
}