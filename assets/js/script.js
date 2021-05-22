let allQuotes;
let allAuthors;
var rightAuthorName;
var playerName;
let topic;
let difficulty;
let numberOfQuotes;


$('document').ready(function () {

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
            difficulty = document.getElementById('difficulty');
            if (!playerName) {
                alert("Come on, you must have a name!");
            } else {
                switch(topic) {
                    case 'lotr':
                        lotr();
                        break;
                    case y:
                        break;
                    default:
                        console.log('invalid category');
                  }
            }
        }
    );

});


function lotr() {
    // get all quotes

    let quotesRequest = new XMLHttpRequest();
    quotesRequest.open('GET', 'https://the-one-api.dev/v2/quote/');
    quotesRequest.setRequestHeader('Authorization', 'Bearer TLVn4EUDXxn5E9lePgAT');
    quotesRequest.onload = function () {
        if (quotesRequest.status === 200) {
            allQuotes = $.parseJSON(quotesRequest.responseText);

            // get all characters

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
                    $('.characters').removeClass('hidden');
                    $('.score-area').removeClass('hidden');
                    $('.progression-area').removeClass('hidden');
                    document.getElementById('number-of-quotes').innerText = numberOfQuotes;
                    playGame(allQuotes, allAuthors, playerName);
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



function playGame(allQuotes, allAuthors, playerName) {
    console.log(playerName, " playgame");
    let checkProgression = parseInt(document.getElementById('progression').innerText);
    let numberOfQuotes = parseInt(document.getElementById('number-of-quotes').innerText);
    if (checkProgression <= numberOfQuotes) {
        getQuote(allQuotes, allAuthors);
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

function getQuote(allQuotes, allAuthors) {

    let quoteId = Math.floor(Math.random() * allQuotes.docs.length) + 1;
    let quoteText = allQuotes.docs[quoteId].dialog;

    // adding quote to the dom, from now on no need to be passed / stored

    $('.quote').html(quoteText);
    let rightCharacterId = allQuotes.docs[quoteId].character;
    getCharacters(allAuthors, rightCharacterId);
}

function getCharacters(allAuthors, rightCharacterId) {

    //get names and ids of two fake characters

    do {
        let rnd = Math.floor(Math.random() * allAuthors.docs.length) + 1;
        var fakeCharacterId1 = allAuthors.docs[rnd]._id;
        var fakeCharacterName1 = allAuthors.docs[rnd].name;
    } while (fakeCharacterId1 === rightCharacterId);

    do {
        let rnd = Math.floor(Math.random() * allAuthors.docs.length) + 1;
        var fakeCharacterId2 = allAuthors.docs[rnd]._id;
        var fakeCharacterName2 = allAuthors.docs[rnd].name;
    } while (fakeCharacterId2 === rightCharacterId);

    // find name of right character

    for (let i = 0; i < allAuthors.docs.length; i++) {
        if (rightCharacterId === allAuthors.docs[i]._id) {
            rightAuthorName = allAuthors.docs[i].name;
            // break;
        }
    }

    let threeNames = [rightAuthorName, fakeCharacterName1, fakeCharacterName2];

    // is the "threeNames =" needed?

    threeNames = shuffle(threeNames);

    document.getElementById('char-1').innerText = threeNames[0];
    document.getElementById('char-2').innerText = threeNames[1];
    document.getElementById('char-3').innerText = threeNames[2];

}

function updateProgression(allQuotes, allAuthors) {

    let currentProgression = parseInt(document.getElementById('progression').innerText);
    currentProgression++;
    document.getElementById('progression').innerText = currentProgression;
    playGame(allQuotes, allAuthors, playerName);
}

$('.char-btn').click(function () {
    if (rightAuthorName === this.innerText) {

        $(this).addClass('right-answer');
        updateScore(5);
    } else {

        $(this).addClass('wrong-answer');
        let characters = [document.getElementById('char-1').innerText, document.getElementById('char-2').innerText, document.getElementById('char-3').innerText];
        switch (findRightAnswer(rightAuthorName, characters)) {
            case 0:
                $('#char-1').addClass('right-answer');
                break;
            case 1:
                $('#char-2').addClass('right-answer');
                break;
            case 2:
                $('#char-3').addClass('right-answer');
                break;
        }
        updateScore(-2);
    }
    setTimeout(function () {
        $('#char-1').removeClass('right-answer').removeClass('wrong-answer');
        $('#char-2').removeClass('right-answer').removeClass('wrong-answer');
        $('#char-3').removeClass('right-answer').removeClass('wrong-answer');
        updateProgression(allQuotes, allAuthors);
    }, 500);


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
            score: Math.floor(Math.random() * 10) + 1
        },
        {
            name: 'Christina',
            score: Math.floor(Math.random() * 10) + 1
        },
        {
            name: 'Irene',
            score: Math.floor(Math.random() * 10) + 1
        },
        {
            name: 'Marty',
            score: Math.floor(Math.random() * 10) + 1
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