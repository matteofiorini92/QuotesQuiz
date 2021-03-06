# QuotesQuiz

![home page all screen sizes](https://raw.githubusercontent.com/matteofiorini92/QuotesQuiz/master/assets/img/wireframes/readme-different-viewports.png)

[Link to deployed website](https://matteofiorini92.github.io/QuotesQuiz/)

QuotesQuiz is an online game. The player is presented with a quote and needs to guess who said it, choosing between multiple options.

# Table Of Contents

-   [User Experience](#user-experience)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Testing](#testing)
-   [Deployment](#deployment)
-   [Credits](#credits)

## User Experience

-   [User Stories](#user-stories)
-   [The Scope Plane](#the-Scope-plane)
-   [The Structure Plane](#the-structure-plane)
-   [Wireframes](#wireframes)
-   [The Surface Plane](#the-surface-plane)


### User Stories

The goal of this game is to guess who said a specific quote. Quotes will be divided into categories.
At the beginning of the game, the player will choose the category, game difficulty and number of quotes.
For each right answer, the player will gain points, while when the answer is wrong, they will lose points.

- User story 1: I want to prove to myself how well I know a specific subject (movies, books, etc.).
- User story 2: I want to challenge my friends on who knows a particular topic the best

### The Scope Plane

Users want to have fun playing a game that will challenge their knowledge on a subject of which they consider themselves experts.


### The Structure Plane

The website will have only one page. The content of the page will change based on the user's choices.
The first version of the page will have 4 questions:
- Name of the player
- Topic
- Number of questions (1-15)
- Difficulty (this will impact the amount of options given to the user)

Once the user has filled in all these fields the game starts:
- The previous fields will disappear from the page
- On the page there will be one quote, 3 or 5 options based on the difficulty chosen, a progression bar and the current score.
- At the end, the page will have a scoreboard with 4 made up players with the relevant random scores and the actual player with their score.


### Wireframes

- [Initial Page Wireframe](https://raw.githubusercontent.com/matteofiorini92/QuotesQuiz/master/assets/img/wireframes/initial-screen.png)
- [Game Page Wireframe](https://raw.githubusercontent.com/matteofiorini92/QuotesQuiz/master/assets/img/wireframes/game.png)
- [Scoreboard Page Wireframe](https://raw.githubusercontent.com/matteofiorini92/QuotesQuiz/master/assets/img/wireframes/scoreboard.png)

### The Surface Plane

The color palette of the website will be white - light blue - blue
The font will be Ubuntu.

## Features

-   [Existing Features](#existing-features)
-   [Features Left to Implement](#features-left-to-implement)
 
### Existing Features

- Feature 1 - Choice of 4 topics
- Feature 2 - 2 levels of difficulty
- Feature 3 - Choice of number of quotes to guess


### Features Left to Implement
- 2 Players mode (1v1)

## Technologies Used

- [Balsamiq](https://balsamiq.com/) for the wireframes of this readme.md file
- [Bootstrap](https://getbootstrap.com/) to use the grid system, pre-formatted buttons and the scoreboard table
- [Google Fonts](https://fonts.google.com/) for fonts
- [JQuery](https://code.jquery.com/)
- [FreeLogoDesign](https://www.freelogodesign.org/) to design the logo
- [Canva](https://www.canva.com/) to create the background image
- [TinyPng](https://tinypng.com/) to reduce the size of the background
- [Friends API](https://friends-quotes-api.herokuapp.com/)
- [Lord Of The Rings API](https://the-one-api.dev/)
- [Game of Thrones API](https://github.com/wsizoo/game-of-thrones-quotes)
- [Breaking Bad API](https://breakingbadapi.com/)

## Testing

Usability and responsiveness were tested on the following browsers:
- Google Chrome Version 90.0.4430.212 (Official Build) (x86_64)
- Mozilla Firefox Version 72.0.2 (32-bit)
- Safari Version 13.0.5 (15608.5.11)

All sections and divs adapted to the screen size as expected, all links worked fine and the navigation was flawless.
Some styling gets lots using Firefox (e.g. the "how to play" bar) but the rest of the website worked without any issues.

 
- User story 1: I want to prove to myself how well I know a specific subject (movies, books, etc.).
The player is able to challenge themselves on a number of topics, choosing the difficulty and length of the challenge.
The final scoreboard is made with random scores, it doesn't give a realistic idea of what the player's score is - a more accurate scoreboard with real previous scores will be implemented in the future.

- User story 2: I want to challenge my friends on who knows a particular topic the best
The scoring system allows multiple players to play one after the other, and see who knows a particular topic best by comparing the final points. This needs to be done by the players as the system doesn't record the scoring of previous games.

The Google Chrome Lighthouse reports for Desktop and Mobile:
- ![Desktop](https://raw.githubusercontent.com/matteofiorini92/QuotesQuiz/master/assets/img/lighthouse/lighthouse-desktop.png)
- ![Mobile](https://raw.githubusercontent.com/matteofiorini92/QuotesQuiz/master/assets/img/lighthouse/lighthouse-mobile.png)


I used the following validators to check my HTML, CSS and JavaScript code:

[HTML Validator](https://validator.w3.org/)
- [Home Page](https://validator.w3.org/nu/?doc=https%3A%2F%2Fmatteofiorini92.github.io%2FQuotesQuiz%2F)

[CSS Validator](https://jigsaw.w3.org/css-validator/)

- [style.css file](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fmatteofiorini92.github.io%2FQuotesQuiz%2Fassets%2Fcss%2Fstyle.css&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)
<p>
    <a href="https://jigsaw.w3.org/css-validator/check/referer">
        <img style="border:0;width:88px;height:31px"
            src="https://jigsaw.w3.org/css-validator/images/vcss-blue"
            alt="Valid CSS!" />
    </a>
</p>

[JS Validator](https://jshint.com/)

### Bugs

- Issues with background image not responsive:
    - tried using cover and contain based on the size of the viewport but that didn't work)
    - fixed by setting the background-size property to 100% auto
- Characters button text turning black once clicked:
    - fixed by adding color: #FFF to the right-answer / wrong-answer classes
- Fake results calculations giving unrealistic scores:
    - fake results for made up players was calculating a random number between the lowest and highest achievable scores for that game
    - this gives unrealistic results, for example a game of 1 round can only have a result of either 5 or -2, it can't give a result of 0
    - changed logic so that for each fake character the system adds either 5 or -2 randomly, for the number of rounds of the game
- 2 extra characters for "hard" version weren't hidden at the end of the gaem
    - fixed this by adding the "hidden" class to the "hard" characters buttons
- Names of the wrong characters were just checked against the right answer. This could give duplicates as there could be two wrong characters with the same name
    - changed logic used to retrieve the wrong characters fake names, so that each new name was compared with the right name and existing wrong answers
- Deployed website wasn't workin because GitHub pages only works with relative paths, not with absolute paths
    - switch paths to relative
- Click of Start Game button firing multiple times
    - fixed by adding e.stopImmediatePropagation() to the event listener as suggested in [this](https://stackoverflow.com/a/24564826) StackOverflow thread.
- When trying to clean up the code and merge duplicated code into functions, the processing of two topics (friends and got) stopped working as the structure of the response was different:
    - fixed by adapting the structure of allAuthors to an array of objects for these two topics as well, so that the same function could be used to process allAuthors for all topics.
- The friends API is slow to respond the first time: a loading icon should be added while waiting for the response.
            

## Deployment

[Link to deployed website](https://matteofiorini92.github.io/QuotesQuiz/)

This project was developed using GitPod, pushed to GitHub and deployed using GitHub Pages.

To deploy to GitHub Pages from its GitHub repository, the following steps were taken:

1. Log into GitHub
2. From the list of repositories on the screen, select **matteofiorini92/QuotesQuiz**
3. From the menu items near the top of the page, select **Settings**
4. Scroll down to the **GitHub Pages** section
5. Under **Source** click the drop-down menu labelled **None** and select **master**
6. In the **folder** drop-down, the **/root** folder is automatically selected
7. Click on **Save**
8. The project is now deployed and the URL of the website is available in the GitHub Pages section

### Hot to run this project locally

To clone this project into Gitpod you will need:

1. A Github account
2. Use the Chrome browser

Then follow these steps:

1. Install the Gitpod Browser Extension for Chrome
2. After installation, restart the browser
3. Log into Gitpod with your gitpod account
4. Navigate to the Project GitHub repository
5. Click the green GitPod button in the top right corner of the repository
6. This will trigger a new gitpod workspace to be created

To work on the project code within a local IDE such as VSCode, Pycharm etc:

1. Follow this link to the [GitHub repository](https://github.com/matteofiorini92/QuotesQuiz)
2. Click on the Code button
3. In the drop-down, copy the URL that you see in the HTTPs tab
4. In your local IDE, open the terminal
5. Change the current working directory to the location where you want the cloned directory to be made
6. Type git clone and paste the URL you copied in Step 3
7. Press Enter. Your local clone will be created.

## Credits


### Acknowledgements

The content of the deployment section of this readme.md was mostly taken from [this webinar](https://www.youtube.com/watch?v=7BteidgLAyM).