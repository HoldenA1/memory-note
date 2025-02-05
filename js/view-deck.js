import { openDb, DECKS_STORE_NAME } from './database.js';

const heading = document.querySelector('h1');
const title = document.querySelector('title');
const parsedUrl = new URL(window.location.href);
const deckId = parsedUrl.searchParams.get('deck');

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

// function displayCards() {
//   // First, clear the content
//   deckCardsContainer.textContent = '';
//   // Open the object store, then get a cursor list of the items to iterate
//   const objectStore = db.transaction(DECKS_STORE_NAME).objectStore(DECKS_STORE_NAME);
//   objectStore.openCursor().onsuccess = (event) => {
//     const cursor = event.target.result;

//     if (!cursor) return; // All items iterated

//     const { deckName, id } = cursor.value;

//     const card = document.createElement('deck-card');
//     card.setAttribute('deck-name', deckName);
//     card.setAttribute('deck-id', id);

//     deckCardsContainer.appendChild(card);

//     cursor.continue();
//   };
// };