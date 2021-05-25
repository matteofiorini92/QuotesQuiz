let allQuotes = "";
let allAuthors = "";
var rightAuthorName = "";
var playerName;
let topic = "";
let difficulty = "";
let numberOfQuotes = "";
let quoteText = "";


$('document').ready(beginning);

function beginning() {


    $('.player').removeClass('hidden');
    $('.scoreboard').addClass('hidden');
    $('#start-over').addClass('hidden');
    //populate n. of quotes to guess
    let options = "";
    for (let i = 1; i <= 20; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    $('#quotes').html(options);

    $('#start-btn').click(
        function () {

            playerName = document.getElementById('player-name').value;
            numberOfQuotes = document.getElementById('quotes').value;
            topic = document.getElementById('topic').value;
            difficulty = document.getElementById('difficulty').checked;
            if (!playerName) {
                alert("Come on, you must have a name!");
            } else {
                // https://css-tricks.com/updating-a-css-variable-with-javascript/
                let progressionPercentage = (1 / numberOfQuotes) * 100;
                let root = document.documentElement;
                root.style.setProperty('--progression-percentage', progressionPercentage + '%');

                switch (topic) {
                    case 'lotr':
                        lotr();
                        break;
                    case 'got':
                        got();
                        break;
                    default:
                        console.log('invalid category');
                }
            }
        }
    );

}


function playGame() {
    let checkProgression = parseInt(document.getElementById('progression').innerText);
    let numberOfQuotes = parseInt(document.getElementById('number-of-quotes').innerText);
    if (checkProgression <= numberOfQuotes) {
        getQuote();
    } else {
        let finalScore = parseInt(document.getElementById('score').innerText);
        $('.quote').addClass('hidden');
        $('.characters').addClass('hidden');
        $('.score-area').addClass('hidden');
        $('.progression-area').addClass('hidden');

        scoreboard(playerName, finalScore);
        // $('.scoreboard').removeClass('hidden');
        // $('.scoreboard').html(`<p>Congratulations! Your final score is ${finalScore} </p>`);
    }
}

function getQuote() {

    let quoteId = "";

    switch (topic) {

        case 'lotr':
            quoteId = Math.floor(Math.random() * allQuotes.docs.length);
            quoteText = allQuotes.docs[quoteId].dialog;
            $('.quote').html(quoteText);
            let rightCharacterId = allQuotes.docs[quoteId].character;
            getCharacters(rightCharacterId);
            break;
        case 'got':
            //get quote
            let quoteRequest = new XMLHttpRequest();
            quoteRequest.open('GET', 'https://got-quotes.herokuapp.com/quotes');
            quoteRequest.onload = function () {
                if (quoteRequest.status === 200) {
                    quote = $.parseJSON(quoteRequest.responseText);
                    quoteText = quote.quote;
                    $('.quote').html(quoteText);
                    rightAuthorName = quote.character;
                    getCharacters(rightAuthorName);
                }
            }
            quoteRequest.send();
            break;
        default:
            console.log('invalid choice', topic);
    }

}

function getCharacters(rightAuthor) {

    switch (topic) {

        case 'lotr':
            //get names and ids of two fake characters

            do {
                let rnd = Math.floor(Math.random() * allAuthors.docs.length);
                var fakeCharacterId1 = allAuthors.docs[rnd]._id;
                var fakeCharacterName1 = allAuthors.docs[rnd].name;
            } while (fakeCharacterId1 === rightAuthor);

            do {
                let rnd = Math.floor(Math.random() * allAuthors.docs.length);
                var fakeCharacterId2 = allAuthors.docs[rnd]._id;
                var fakeCharacterName2 = allAuthors.docs[rnd].name;
            } while (fakeCharacterId2 === rightAuthor);

            // difficulty = hard >> two more characters
            if (!difficulty) {
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.docs.length);
                    var fakeCharacterId3 = allAuthors.docs[rnd]._id;
                    var fakeCharacterName3 = allAuthors.docs[rnd].name;
                } while (fakeCharacterId3 === rightAuthor);

                do {
                    let rnd = Math.floor(Math.random() * allAuthors.docs.length);
                    var fakeCharacterId4 = allAuthors.docs[rnd]._id;
                    var fakeCharacterName4 = allAuthors.docs[rnd].name;
                } while (fakeCharacterId4 === rightAuthor);

            }

            // find name of right character

            for (let i = 0; i < allAuthors.docs.length; i++) {
                if (rightAuthor === allAuthors.docs[i]._id) {
                    rightAuthorName = allAuthors.docs[i].name;
                    // break;
                }
            }
            break;

        case 'got':
            do {
                let rnd = Math.floor(Math.random() * allAuthors.length);
                var fakeCharacterName1 = allAuthors[rnd];
            } while (fakeCharacterName1 === rightAuthor);
            do {
                let rnd = Math.floor(Math.random() * allAuthors.length);
                var fakeCharacterName2 = allAuthors[rnd];
            } while (fakeCharacterName2 === rightAuthor);


            if (!difficulty) {
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.length);
                    var fakeCharacterName3 = allAuthors[rnd];
                } while (fakeCharacterName3 === rightAuthor);
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.length);
                    var fakeCharacterName4 = allAuthors[rnd];
                } while (fakeCharacterName4 === rightAuthor);
            }
            rightAuthorName = rightAuthor;
            break;

        default:
            console.log('invalid choice');

    }

    if (difficulty) {
        let threeNames = [rightAuthorName, fakeCharacterName1, fakeCharacterName2];

        // is the "threeNames =" needed?

        threeNames = shuffle(threeNames);

        document.getElementById('char-1').innerText = threeNames[0];
        document.getElementById('char-2').innerText = threeNames[1];
        document.getElementById('char-3').innerText = threeNames[2];
    } else {
        let fiveNames = [rightAuthorName, fakeCharacterName1, fakeCharacterName2, fakeCharacterName3, fakeCharacterName4];

        // is the "fiveNames =" needed?

        fiveNames = shuffle(fiveNames);

        document.getElementById('char-1').innerText = fiveNames[0];
        document.getElementById('char-2').innerText = fiveNames[1];
        document.getElementById('char-3').innerText = fiveNames[2];
        document.getElementById('char-4').innerText = fiveNames[3];
        document.getElementById('char-5').innerText = fiveNames[4];
    }



}

function updateProgression() {

    let currentProgression = parseInt(document.getElementById('progression').innerText);
    currentProgression++;
    document.getElementById('progression').innerText = currentProgression;
    // https://css-tricks.com/updating-a-css-variable-with-javascript/
    let progressionPercentage = (currentProgression / numberOfQuotes) * 100;
    let root = document.documentElement;
    root.style.setProperty('--progression-percentage', progressionPercentage + '%');
    playGame();
}

$('.char-btn').click(function () {
    if (rightAuthorName === this.innerText) {

        $(this).removeClass('btn-primary').addClass('right-answer');
        updateScore(5);
    } else {

        $(this).removeClass('btn-primary').addClass('wrong-answer');
        let characters = [document.getElementById('char-1').innerText, document.getElementById('char-2').innerText, document.getElementById('char-3').innerText, document.getElementById('char-4').innerText, document.getElementById('char-5').innerText];
        switch (findRightAnswer(rightAuthorName, characters)) {
            case 0:
                $('#char-1').removeClass('btn-primary').addClass('right-answer');
                break;
            case 1:
                $('#char-2').removeClass('btn-primary').addClass('right-answer');
                break;
            case 2:
                $('#char-3').removeClass('btn-primary').addClass('right-answer');
                break;
            case 3:
                $('#char-4').removeClass('btn-primary').addClass('right-answer');
                break;
            case 4:
                $('#char-5').removeClass('btn-primary').addClass('right-answer');
                break;
        }
        updateScore(-2);
    }
    setTimeout(function () {
        $('#char-1').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-2').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-3').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-4').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-5').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        updateProgression();
    }, 1500);


});

function findRightAnswer(rightAuthorName, characters) {
    for (let i = 0; i < characters.length; i++) {
        if (rightAuthorName === characters[i]) {
            return i;
            break;
        }
    }
}



// common functions for all topics

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

function shuffle(array) {

    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function updateScore(points) {

    let currentScore = parseInt(document.getElementById('score').innerText);
    currentScore += points;
    document.getElementById('score').innerText = currentScore;
}


function scoreboard(playerName, finalScore) {
    console.log(playerName);
    let players = [{
            name: 'Mark',
            score: getRandomIntInclusive(-2 * numberOfQuotes, 5 * numberOfQuotes)
        },
        {
            name: 'Christina',
            score: getRandomIntInclusive(-2 * numberOfQuotes, 5 * numberOfQuotes)
        },
        {
            name: 'Irene',
            score: getRandomIntInclusive(-2 * numberOfQuotes, 5 * numberOfQuotes)
        },
        {
            name: 'Marty',
            score: getRandomIntInclusive(-2 * numberOfQuotes, 5 * numberOfQuotes)
        },
        {
            name: playerName,
            score: finalScore
        }
    ];

    players.sort(compare);
    let scoreboardHTML = "";
    for (let i = 0; i < players.length; i++) {
        scoreboardHTML += `<p>${i+1} - ${players[i].score} ${players[i].name}</p>`;
    }
    $('.scoreboard').html(scoreboardHTML);

    $('.scoreboard').removeClass('hidden');
    $('#start-over').removeClass('hidden');


}

$('#start-over').click(function () {
    document.getElementById('progression').innerText = 1;
    document.getElementById('score').innerText = 0;
    beginning();
});

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// https://stackoverflow.com/a/1129270
function compare(a, b) {
    if (a.score > b.score) {
        return -1;
    }
    if (a.score < b.score) {
        return 1;
    }
    return 0;
}

// SPECIFIC -- LOTR

function lotr() {
    // get all quotes

    let quotesRequest = new XMLHttpRequest();
    quotesRequest.open('GET', 'https://the-one-api.dev/v2/quote/');
    quotesRequest.setRequestHeader('Authorization', 'Bearer TLVn4EUDXxn5E9lePgAT');
    quotesRequest.onload = function () {
        if (quotesRequest.status === 200) {
            allQuotes = $.parseJSON(quotesRequest.responseText);

            // get all authors

            let charactersRequest = new XMLHttpRequest();
            charactersRequest.open('GET', 'https://the-one-api.dev/v2/character/');
            charactersRequest.setRequestHeader('Authorization', 'Bearer TLVn4EUDXxn5E9lePgAT');

            charactersRequest.onload = function () {
                if (charactersRequest.status === 200) {
                    allAuthors = $.parseJSON(charactersRequest.responseText);
                    console.log(allQuotes);
                    console.log(allAuthors);
                    // once all quotes and all characters are loaded, start game
                    $('.player').addClass('hidden');
                    $('.quote').removeClass('hidden');
                    $('.characters').removeClass('hidden');
                    if (!difficulty) {
                        $('.characters-hard').removeClass('hidden');
                    }
                    $('.score-area').removeClass('hidden');
                    $('.progression-area').removeClass('hidden');
                    document.getElementById('number-of-quotes').innerText = numberOfQuotes;
                    playGame();
                }
            }
            charactersRequest.onerror = function (e) {
                console.error(charactersRequest.statusText)
            }
            charactersRequest.send();
        }
    }
    quotesRequest.onerror = function (e) {
        console.error(quotesRequest.statusText)
    }
    quotesRequest.send();
}

// SPECIFIC -- GOT

function got() {
    allAuthors = ["Bronn", "Brynden Tully", "Cersei", "The Hound", "Jaime Lannister", "Littlefinger", "Olenna Tyrell", "Renly Baratheon", "Tyrion", "Varys"];
    $('.player').addClass('hidden');
    $('.quote').removeClass('hidden');
    $('.characters').removeClass('hidden');
    if (!difficulty) {
        $('.characters-hard').removeClass('hidden');
    }
    $('.score-area').removeClass('hidden');
    $('.progression-area').removeClass('hidden');
    document.getElementById('number-of-quotes').innerText = numberOfQuotes;
    playGame();
}