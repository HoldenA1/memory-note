import { openDb, DECKS_STORE_NAME, CARDS_STORE_NAME } from './database.js';

const heading = document.querySelector('h1');
const title = document.querySelector('title');
const parsedUrl = new URL(window.location.href);
const deckId = parseInt(parsedUrl.searchParams.get('deck'));
const termsContainer = document.getElementById('terms');
const plus = document.querySelector('.plus-button');

plus.setAttribute('href', './create-flashcard.html?deck=' + deckId)

// Hold an instance of a db object
let db;

function onerror() {
  console.error('Error loading database.');
};

function onsuccess(event) {
  // Store the result of opening the database in the db variable
  db = event.target.result;
  // Populate the data already in the IndexedDB
  setDeckTitle();
  displayCards();
};

// Open the database and get our db instance
openDb(onsuccess, onerror);

function setDeckTitle() {
  const objectStore = db.transaction(DECKS_STORE_NAME).objectStore(DECKS_STORE_NAME);
  const req = objectStore.get(parseInt(deckId));
  req.onsuccess = () => {
    let name = req.result.deckName;
    title.textContent = name + ' | Omoidasu Noto';
    heading.textContent = name;
  }
}

function getFlashcardsForDeck(deckId, callback) {
  const transaction = db.transaction(CARDS_STORE_NAME, 'readonly');
  const store = transaction.objectStore(CARDS_STORE_NAME);
  
  // Find all cards in the deck
  const index = store.index('deckId');
  const range = IDBKeyRange.only(deckId);
  const getRequest = index.getAll(range);
  
  getRequest.onsuccess = () => callback(getRequest.result);
}

class Flashcard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Build the component here
    const shadow = this.attachShadow({ mode: "open" });
    let term = this.getAttribute('term');
    let defn = this.getAttribute('defn');
    let t1 = document.createElement('p');
    t1.textContent = term;
    shadow.appendChild(t1);
    let t2 = document.createElement('p');
    t2.textContent = defn;
    shadow.appendChild(t2);
  }
}

customElements.define('flash-card', Flashcard);

function displayCards() {
  // First, clear the content
  termsContainer.textContent = '';
  // Retrieve card data from store
  getFlashcardsForDeck(deckId, (cards) => {
    console.log(cards);
    if (cards.length > 0) {
      cards.forEach(card => {
        const cardEl = document.createElement('flash-card');
        cardEl.setAttribute('term', card.term);
        cardEl.setAttribute('defn', card.defn);
  
        termsContainer.appendChild(cardEl);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = 'There don\'t appear to be any flashcards yet. Try adding some to the deck';
      termsContainer.appendChild(p);
    }
  });
};