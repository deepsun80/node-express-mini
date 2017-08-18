const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};
const wordsArray = readWords();
const word = wordsArray[Math.floor(Math.random() * wordsArray.length)].toLowerCase();

const wordArray = [];

// TODO: your code to handle requests
//GET
server.get('/guess', (req, res) => {
  const wordSoFar = [];
  if (wordArray.length === 0) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a letter' });
    return;
  }
  if (wordArray.length > 5) {
    res.status(STATUS_USER_ERROR);
    res.send(`Sorry, too many guesses, the correct answer is ${word}`);
    return;
  }
  for (let i = 0; i < word.length - 1; i++) {
    wordSoFar.push('-');
    wordArray.forEach((element) => {
      if (element === word[i]) {
        wordSoFar.splice(i, 1, word[i]);
      }
    });
  }
  const wordSoFarToString = wordSoFar.join('');
  const guessesSoFar = wordArray.toString();
  //console.log(word);
  //console.log(wordArray);
  res.json({ 
    wordSoFar: wordSoFarToString,
    guesses: guessesSoFar
  });
});

//POST
server.post('/guess', (req, res) => {
  const letter = req.body.letter;
  if (!letter) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'Must provide a letter' });
    return;
  }
  wordArray.forEach((element) => {
    if (letter === element) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'Must provide a different letter' });
      return;
    }
  });
  wordArray.push(letter);
  res.json({ wordArray });
});

server.listen(3000);
