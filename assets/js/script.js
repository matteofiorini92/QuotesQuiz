// Declaring globla variables

let allQuotes = "";
let allAuthors = "";
let rightAuthorName = "";
let playerName;
let topic = "";
let difficulty = "";
let numberOfQuotes = "";
let quoteText = "";


$('document').ready(start);

// from https://www.w3schools.com/howto/howto_css_modals.asp
// Get the modal
var modal = document.getElementById("myModal");
var paragraph = document.getElementById("instructions-p");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
paragraph.onclick = function () {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// The start funcion is called when the page is initially loaded and at the end of each game (after the scoreboard).
// Its purpose is to display the initial "form" for the player to start a new game

function start() {
    document.getElementById('logo').style.height = "200px";
    $('.player').removeClass('hidden');
    $('.scoreboard').addClass('hidden');
    $('.start-over-button').addClass('hidden');
    //populate n. of quotes to guess
    let options = "";
    for (let i = 1; i <= 15; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    $('#quotes').html(options);

    // the start button checks if the name of the player was entered, if so the game starts.
    $('#start-btn').click(
        function (e) {
            // to avoid the click of the button to "fire" twice, used stopImmediatePropagation as per https://stackoverflow.com/a/24564826
            e.stopImmediatePropagation();

            // get all the values chosen by the player
            playerName = document.getElementById('player-name').value;
            numberOfQuotes = document.getElementById('quotes').value;
            topic = document.getElementById('topic').value;
            difficulty = document.getElementById('difficulty').checked;
            if (!playerName) {
                alert("Come on, you must have a name!");
            } else {
                document.getElementById('logo').style.height = "125px";

                // set the progression percentage for the progression bar
                // https://css-tricks.com/updating-a-css-variable-with-javascript/
                let progressionPercentage = (1 / numberOfQuotes) * 100;
                let root = document.documentElement;
                root.style.setProperty('--progression-percentage', progressionPercentage + '%');

                // lotr and bb share the same logic
                // got and friends share the same logic

                switch (topic) {
                    case 'lotr':
                    case 'bb':
                        bigApiRequest();
                        break;
                    case 'got':
                    case 'friends':
                        smallApi();
                        break;
                    default:
                        alert('invalid category');
                }
            }
        }
    );
}

// LOTR (Lord Of The Rings) AND BB (Breaking Bad) have similar structures
// These apis don't allow to retrieve a random quote, hence retrieving all quotes is necessary
// This api contains a lot of different characters, hence retrieving all characters with an api call is necessary

function bigApiRequest() {
    let quotesUrl = '';
    let charactersUrl = '';
    if (topic === 'lotr') {
        quotesUrl = 'https://the-one-api.dev/v2/quote/';
        charactersUrl = 'https://the-one-api.dev/v2/character/';
    } else if (topic === 'bb') {
        quotesUrl = 'https://breakingbadapi.com/api/quotes';
        charactersUrl = 'https://breakingbadapi.com/api/characters';
    }

    // get all quotes
    let quotesRequest = new XMLHttpRequest();
    quotesRequest.open('GET', quotesUrl);
    if (topic === 'lotr') {
        quotesRequest.setRequestHeader('Authorization', 'Bearer TLVn4EUDXxn5E9lePgAT');
    }
    quotesRequest.onload = function () {
        if (quotesRequest.status === 200) {
            if (topic === 'lotr') {
                allQuotes = $.parseJSON(quotesRequest.responseText).docs;
            } else if (topic === 'bb') {
                allQuotes = $.parseJSON(quotesRequest.responseText);
            }

            // once the request for all quotes is successful, get all authors
            let charactersRequest = new XMLHttpRequest();
            charactersRequest.open('GET', charactersUrl);
            if (topic === 'lotr') {
                charactersRequest.setRequestHeader('Authorization', 'Bearer TLVn4EUDXxn5E9lePgAT');
            }
            charactersRequest.onload = function () {
                if (charactersRequest.status === 200) {
                    if (topic === 'lotr') {
                        allAuthors = $.parseJSON(charactersRequest.responseText).docs;
                    } else if (topic === 'bb') {
                        allAuthors = $.parseJSON(charactersRequest.responseText);
                    }
                    // once the request for all authors is successful, call function that will hide initial elements
                    // and display those needed for the game
                    prepareForGame();
                }
            };
            charactersRequest.onerror = function (e) {
                alert(e.statusText);
            };
            charactersRequest.send();
        }
    };
    quotesRequest.onerror = function (e) {
        alert(e.statusText);
    };
    quotesRequest.send();

}

// GOT (Game Of Thrones) AND FRIENDS have similar structures
// These apis allow to retrieve a random quote.
// Quotes contain the name of the character.
// These apis contain just few different characters.

function smallApi() {
    if (topic === 'got') {
        allAuthors = [{
                name: "Bronn"
            },
            {
                name: "Brynden Tully"
            },
            {
                name: "Cersei"
            },
            {
                name: "The Hound"
            },
            {
                name: "Jaime Lannister"
            },
            {
                name: "Littlefinger"
            },
            {
                name: "Olenna Tyrell"
            },
            {
                name: "Renly Baratheon"
            },
            {
                name: "Tyrion"
            },
            {
                name: "Varys"
            }
        ];
    } else if (topic === 'friends') {
        allAuthors = [{
                name: "Rachel"
            },
            {
                name: "Joey"
            },
            {
                name: "Ross"
            },
            {
                name: "Monica"
            },
            {
                name: "Chandler"
            },
            {
                name: "Phoebe"
            }
        ];
    }
    prepareForGame();
}

function prepareForGame() {
    // once all quotes and all characters are loaded, start game
    // hide all items from initial form
    $('.player').addClass('hidden');
    // display quotes, characters, progression area and points
    $('.quote').removeClass('hidden');
    if (difficulty) {
        $('.characters').removeClass('hidden');
    } else {
        $('.characters').removeClass('hidden');
        $('.characters-hard').removeClass('hidden');
    }
    $('#score').removeClass('negative-score').addClass('positive-score');
    $('.score-area').removeClass('hidden');
    $('.progression-area').removeClass('hidden');
    document.getElementById('number-of-quotes').innerText = numberOfQuotes;
    playGame();
}

// The playGame function checks if we are at the end of the game or not

function playGame() {
    let checkProgression = parseInt(document.getElementById('progression').innerText);
    let numberOfQuotes = parseInt(document.getElementById('number-of-quotes').innerText);
    // if there are still rounds to play, get a new quote
    if (checkProgression <= numberOfQuotes) {
        getQuote();
    } else {
        // otherwise get the final score and hide all playing elements
        let finalScore = parseInt(document.getElementById('score').innerText);
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

        // and move to the scoreboard
        scoreboard(playerName, finalScore);
    }
}

function getQuote() {
    let quoteId = "";
    let quoteRequest = new XMLHttpRequest();
    let quote = '';
    switch (topic) {

        case 'lotr':
            quoteId = Math.floor(Math.random() * allQuotes.length);
            quoteText = allQuotes[quoteId].dialog;
            $('.quote').html(quoteText);
            let rightCharacterId = allQuotes[quoteId].character;
            getCharacters(rightCharacterId);
            break;
        case 'bb':
            quoteId = Math.floor(Math.random() * allQuotes.length);
            quoteText = allQuotes[quoteId].quote;
            $('.quote').html(quoteText);
            rightAuthorName = allQuotes[quoteId].author;
            getCharacters(rightAuthorName);
            break;
        case 'got':
            //get quote
            quoteRequest.open('GET', 'https://got-quotes.herokuapp.com/quotes');
            quoteRequest.onload = function () {
                if (quoteRequest.status === 200) {
                    quote = $.parseJSON(quoteRequest.responseText);
                    quoteText = quote.quote;
                    $('.quote').text(quoteText);
                    rightAuthorName = quote.character;
                    getCharacters(rightAuthorName);
                }
            };
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
            };
            quoteRequest.send();
            break;
        default:
            alert('invalid choice', topic);
    }

}

function getCharacters(rightAuthor) {
    let names = [];
    let numberOfFakes = difficulty ? 2 : 4; // difficulty = true > easy game, only 2 fakes, else 4 fakes
    let fakeCharacterName = '';
    if (topic === 'lotr') {
        // find name of right character
        for (let i = 0; i < allAuthors.length; i++) {
            if (rightAuthor === allAuthors[i]._id) {
                rightAuthorName = allAuthors[i].name;
                break;
            }
        }
    }
    // add the right author to the array which will contain all 3 or 5 names
    names.push(rightAuthorName);
    //get names of the fake characters and add them to the array too
    for (let i = 0; i < numberOfFakes; i++) {
        do {
            let rnd = Math.floor(Math.random() * allAuthors.length);
            fakeCharacterName = allAuthors[rnd].name;
        } while (names.includes(fakeCharacterName));
        names.push(fakeCharacterName);
    }
    // shuffle the names and assign them to the buttons
    names = shuffle(names);
    document.getElementById('char-1').innerText = names[0];
    document.getElementById('char-2').innerText = names[1];
    document.getElementById('char-3').innerText = names[2];

    if (!difficulty) {
        document.getElementById('char-4').innerText = names[3];
        document.getElementById('char-5').innerText = names[4];
    }

}

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

// event listener for when one of the characters is selected

$('.char-btn').click(function () {
    // rightAuthorName is a global variable
    if (rightAuthorName === this.innerText) {
        // if player guesses, the button clicked becomes green
        $(this).removeClass('btn-primary').addClass('right-answer');
        updateScore(5);
    } else {
        // if player doesn't guess, the button clicked becomes red
        $(this).removeClass('btn-primary').addClass('wrong-answer');
        let characters = [document.getElementById('char-1').innerText, document.getElementById('char-2').innerText, document.getElementById('char-3').innerText, document.getElementById('char-4').innerText, document.getElementById('char-5').innerText];
        // and the findRightAnswer function is called to find which button to mark in green
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
    // after 1500px all buttons are reset to their original styling
    setTimeout(function () {
        $('#char-1').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-2').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-3').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-4').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        $('#char-5').removeClass('right-answer').removeClass('wrong-answer').addClass('btn-primary');
        updateProgression();
    }, 1500);

});

// add or substract points to the current score and sets the new score in the page
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

// returns the position of the right answer
function findRightAnswer(rightAuthorName, characters) {
    for (let i = 0; i < characters.length; i++) {
        if (rightAuthorName === characters[i]) {
            return i;
        }
    }
}

// updates the progression bar, incrementing the number and the % of green over grey
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

// this function is called after the last round
// it generates a scoreboard made of 4 made up players with random scores, and the actual player

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
    // sort players based on their scores 
    players.sort(compare);

    // and generates a table that's added to the dom
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

// generates a random score for the 4 made up players
function getRandom() {
    let fakeScore = 0;
    for (let i = 0; i < numberOfQuotes; i++) {
        let rnd = Math.floor(Math.random() * 2); //gets random number that is either 0 or 1
        if (rnd === 0) {
            fakeScore += -2;
        } else {
            fakeScore += 5;
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

// when this button is clicked, the game resets and goes back to the initial version of the page
$('#start-over').click(function () {
    document.getElementById('progression').innerText = 1;
    document.getElementById('score').innerText = 0;
    start();
});