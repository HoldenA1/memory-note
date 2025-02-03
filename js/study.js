import { DB_NAME, DB_VERSION, DB_STORE_NAME,
  openDb } from './database.js';

let cards;

// State enums
const QUESTION = 0;
const REVIEW = 1;

let state;
let remaining_count = 0;
let cur_card = 0;

function populateCard(evt) {
  let tx = this.result.transaction(DB_STORE_NAME, 'readwrite');
  let store = tx.objectStore(DB_STORE_NAME);
  let req = store.getAll();
  req.onsuccess = function(evt) {
    state = QUESTION;
    cards = req.result;
    remaining_count = cards.length;
    document.querySelector('h1').innerText = req.result[0].term;
    document.querySelector('#rem-count span').innerText = remaining_count;
    document.querySelector('#comp-count span').innerText = 0;
  };
  req.onerror = function() {
    console.error("add error", this.error);
  };
}

function nextCard() {
  document.querySelector('form').reset();
  cur_card++;
  remaining_count--;
  document.querySelector('#rem-count span').innerText = remaining_count;
  document.querySelector('#comp-count span').innerText = cur_card;
  document.querySelector('h1').innerText = cards[cur_card].term;
}

function checkAnswer(evt) {
  evt.preventDefault();
  const input = document.getElementById('definition');
  const out = document.querySelector('output');
  const submit = document.querySelector('button');

  if (state === QUESTION) {
    // In this state we are asking the user for the definition
    const formData = new FormData(document.querySelector('form'));
    if (cards[cur_card].defn.toLowerCase() == formData.get('definition').trim().toLowerCase()) {
      // Answer was correct
      input.classList.add('correct');
    } else {
      // Answer was incorrect
      input.classList.add('incorrect');
      out.innerText = `Correct Answer: ${cards[cur_card].defn}`;
      out.style = 'display: block;';
    }
    submit.innerText = 'Next Question';
    input.setAttribute('readonly', 'readonly');
    state = REVIEW;
  } else if (state === REVIEW) {
    // In this state the user can review the correct answer
    input.classList = '';
    input.removeAttribute('readonly');
    input.focus();
    submit.innerText = 'Show Answer';
    out.style = 'display: none;';
    nextCard();
    state = QUESTION;
  }
}

function addEventListeners() {
  const form = document.querySelector('form');
  form.addEventListener('submit', checkAnswer);
}

openDb(DB_NAME, DB_VERSION, DB_STORE_NAME, populateCard);
addEventListeners();