let allQuotes = "";
let allAuthors = "";
var rightAuthorName = "";
var playerName;
let topic = "";
let difficulty = "";
let numberOfQuotes = "";
let quoteText = "";
var apiKey = config.apiKey;


$('document').ready(start);

function start() {
    $('.player').removeClass('hidden');
    $('.scoreboard').addClass('hidden');
    $('.start-over-button').addClass('hidden');
    //populate n. of quotes to guess
    let options = "";
    for (let i = 1; i <= 15; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    $('#quotes').html(options);

    $('#start-btn').click(
        function (e) {
//https://stackoverflow.com/a/24564826
            e.stopImmediatePropagation();
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
                    case 'friends':
                        friends();
                        break;
                    case 'bb':
                        breakingBad();
                        break;
                    default:
                        console.log('invalid category');
                }
            }
            // return false;
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
        // $('.quote')[0].empty;
        document.getElementsByClassName('quote')[0].innerText = "";
        $('#char-1').html = "";
        $('#char-2').html = "";
        $('#char-3').html = "";
        $('#char-4').html = "";
        $('#char-5').html = "";
        $('.quote').addClass('hidden');
        $('.characters').addClass('hidden');
        $('.characters-hard').addClass('hidden');
        $('.score-area').addClass('hidden');
        $('.progression-area').addClass('hidden');

        scoreboard(playerName, finalScore);
        // $('.scoreboard').removeClass('hidden');
        // $('.scoreboard').html(`<p>Congratulations! Your final score is ${finalScore} </p>`);
    }
}

function getQuote() {
    let quoteId = "";
    let quoteRequest = new XMLHttpRequest();
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
        case 'friends':
            //get quote

            quoteRequest.open('GET', 'https://friends-quotes-api.herokuapp.com/quotes/random');
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
        case 'bb':
            quoteId = Math.floor(Math.random() * allQuotes.length);
            quoteText = allQuotes[quoteId].quote;
            $('.quote').html(quoteText);
            rightAuthorName = allQuotes[quoteId].author;
            getCharacters(rightAuthorName);
            break;

        default:
            console.log('invalid choice', topic);
    }

}

function getCharacters(rightAuthor) {
    let names = [];
    let numberOfFakes = difficulty ? 2 : 4 // difficulty = true > easy game, only 2 fakes, else 4 fakes
    switch (topic) {

        case 'lotr':

            // find name of right character

            for (let i = 0; i < allAuthors.docs.length; i++) {
                if (rightAuthor === allAuthors.docs[i]._id) {
                    rightAuthorName = allAuthors.docs[i].name;
                    break;
                }
            }
            names.push(rightAuthorName);
            //get names and ids of two fake characters

            for (let i = 0; i < numberOfFakes; i++) {
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.docs.length);
                    // var fakeCharacterId = allAuthors.docs[rnd]._id;
                    var fakeCharacterName = allAuthors.docs[rnd].name;
                } while (names.includes(fakeCharacterName));
                names.push(fakeCharacterName);
            }

            break;

        case 'got':

            // rightAuthorName = rightAuthor;
            names.push(rightAuthorName);
            for (let i = 0; i < numberOfFakes; i++) {
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.length);
                    // var fakeCharacterId = allAuthors.docs[rnd]._id;
                    var fakeCharacterName = allAuthors[rnd];
                } while (names.includes(fakeCharacterName));
                names.push(fakeCharacterName);
            }
            break;
        case 'friends':

            // rightAuthorName = rightAuthor;
            names.push(rightAuthorName);
            for (let i = 0; i < numberOfFakes; i++) {
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.length);
                    // var fakeCharacterId = allAuthors.docs[rnd]._id;
                    var fakeCharacterName = allAuthors[rnd];
                } while (names.includes(fakeCharacterName));
                names.push(fakeCharacterName);
            }
            break;

        case 'bb':
            names.push(rightAuthorName);
            //get names and ids of two/four fake characters

            for (let i = 0; i < numberOfFakes; i++) {
                do {
                    let rnd = Math.floor(Math.random() * allAuthors.length);
                    // var fakeCharacterId = allAuthors.docs[rnd]._id;
                    var fakeCharacterName = allAuthors[rnd].name;
                } while (names.includes(fakeCharacterName));
                names.push(fakeCharacterName);
            }
            break;

        default:
            console.log('invalid choice');
    }

    names = shuffle(names);
    document.getElementById('char-1').innerText = names[0];
    document.getElementById('char-2').innerText = names[1];
    document.getElementById('char-3').innerText = names[2];

    if (!difficulty) {
        document.getElementById('char-4').innerText = names[3];
        document.getElementById('char-5').innerText = names[4];
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
    let score = $('#score');
    let currentScore = parseInt(score[0].innerText);
    currentScore += points;
    score[0].innerText = currentScore;
    if (currentScore > 0) {
        score.removeClass().addClass('positive-score');
    } else if (currentScore < 0) {
        score.removeClass().addClass('negative-score');
    } else {
        score.removeClass();
    }
}


function scoreboard(playerName, finalScore) {
    let players = [{
            name: 'Mark',
            score: getRandom()
        },
        {
            name: 'Cris',
            score: getRandom()
        },
        {
            name: 'Irene',
            score: getRandom()
        },
        {
            name: 'Marty',
            score: getRandom()
        },
        {
            name: playerName,
            score: finalScore
        }
    ];

    players.sort(compare);
    //https://getbootstrap.com/docs/4.1/content/tables/
    let scoreboardHTML = `
    <table class="table table-hover table-dark">
    <thead>
    <tr>
    <th scope="col">#</th>
    <th scope="col">Player</th>
    <th scope="col" class="column-score">Score</th>
    </tr>
    </thead>
    <tbody>
    `;
    for (let i = 0; i < players.length; i++) {
        scoreboardHTML += `<tr>
        <th scope="row">${i+1}</td>
        <td class="table-player">${players[i].name}</td>
        <td class="table-score">${players[i].score}</td>
        </tr>`;
    }
    scoreboardHTML += `</tbody>
    </table>`;
    $('.scoreboard').html(scoreboardHTML);

    $('.scoreboard').removeClass('hidden');
    $('.start-over-button').removeClass('hidden');


}

$('#start-over').click(function () {
    document.getElementById('progression').innerText = 1;
    document.getElementById('score').innerText = 0;
    start();
});

// //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
// }

function getRandom() {
    let fakeScore = 0;
    for (let i = 0; i < numberOfQuotes; i++) {
        let rnd = Math.floor(Math.random() * 2); //gets random number that is either 0 or 1
        if (rnd === 0) {
            fakeScore += -2
        } else {
            fakeScore += 5
        }
    }
    return fakeScore;
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
    quotesRequest.setRequestHeader('Authorization', 'Bearer ' + apiKey);
    quotesRequest.onload = function () {
        if (quotesRequest.status === 200) {
            allQuotes = $.parseJSON(quotesRequest.responseText);

            // get all authors

            let charactersRequest = new XMLHttpRequest();
            charactersRequest.open('GET', 'https://the-one-api.dev/v2/character/');
            charactersRequest.setRequestHeader('Authorization', 'Bearer ' + apiKey);

            charactersRequest.onload = function () {
                if (charactersRequest.status === 200) {
                    allAuthors = $.parseJSON(charactersRequest.responseText);
                    // once all quotes and all characters are loaded, start game
                    $('.player').addClass('hidden');
                    $('.quote').removeClass('hidden');
                    if (difficulty) {
                        $('.characters').removeClass('hidden');
                        // $('.btn-container').addClass('col-12 col-md-3');
                    } else {
                        $('.characters').removeClass('hidden');
                        $('.characters-hard').removeClass('hidden');
                        // $('.btn-container').addClass('col-12 col-md-3');
                        // $('.btn-container-hard').addClass('col-12 col-md-4');
                    }
                    $('.score-area').removeClass('hidden');
                    $('.progression-area').removeClass('hidden');
                    document.getElementById('number-of-quotes').innerText = numberOfQuotes;
                    playGame();
                }
            }
            charactersRequest.onerror = function (e) {
                console.error(e.statusText)
            }
            charactersRequest.send();
        }
    }
    quotesRequest.onerror = function (e) {
        console.error(e.statusText);
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

// SPECIFIC FRIENDS

function friends() {
    allAuthors = ["Rachel", "Joey", "Ross", "Monica", "Chandler", "Phoebe"];
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

// SPECIFIC BREAKING BAD

function breakingBad() {
    // get all quotes

    let quotesRequest = new XMLHttpRequest();
    quotesRequest.open('GET', 'https://breakingbadapi.com/api/quotes');
    quotesRequest.onload = function () {
        if (quotesRequest.status === 200) {
            allQuotes = $.parseJSON(quotesRequest.responseText);

            // get all authors

            let charactersRequest = new XMLHttpRequest();
            charactersRequest.open('GET', 'https://breakingbadapi.com/api/characters');
            charactersRequest.onload = function () {
                if (charactersRequest.status === 200) {
                    allAuthors = $.parseJSON(charactersRequest.responseText);
                    // once all quotes and all characters are loaded, start game
                    $('.player').addClass('hidden');
                    $('.quote').removeClass('hidden');
                    if (difficulty) {
                        $('.characters').removeClass('hidden');
                        // $('.btn-container').addClass('col-12 col-md-3');
                    } else {
                        $('.characters').removeClass('hidden');
                        $('.characters-hard').removeClass('hidden');
                        // $('.btn-container').addClass('col-12 col-md-3');
                        // $('.btn-container-hard').addClass('col-12 col-md-4');
                    }
                    $('.score-area').removeClass('hidden');
                    $('.progression-area').removeClass('hidden');
                    document.getElementById('number-of-quotes').innerText = numberOfQuotes;
                    playGame();
                }
            }
            charactersRequest.onerror = function (e) {
                console.error(e.statusText)
            }
            charactersRequest.send();
        }
    }
    quotesRequest.onerror = function (e) {
        console.error(e.statusText);
    }
    quotesRequest.send();
}