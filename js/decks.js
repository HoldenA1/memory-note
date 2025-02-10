import { openDb, getDecksInfo, DECKS_STORE_NAME, displayActionFailure, displayActionSuccess } from './database.js';

// All UI elements we need for the app
const form = document.querySelector('form');
const dialog = document.getElementById('new-deck-dialog');
const dialogCancel = document.getElementById('cancel')
const plusButton = document.getElementById('create-deck');
const deck = document.getElementById('deckName');
const deckCardsContainer = document.getElementById('deck-cards');
const output = document.querySelector('output');


// Hold an instance of a db object
let db;

function onerror() {
  displayActionFailure(output, 'Error loading database.');
};

function onsuccess(event) {
  // Store the result of opening the database in the db variable
  db = event.target.result;
  // Populate the data already in the IndexedDB
  displayDecks();
};

// Open the database and get our db instance
openDb(onsuccess, onerror);

class DeckCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Build the component here
    const shadow = this.attachShadow({ mode: "open" });
    const link = document.createElement('a');
    link.textContent = this.getAttribute("deck-name");
    let id = this.getAttribute('deck-id');
    let url = `./view-deck.html?deck=${id}`;
    link.setAttribute('href', url);
    shadow.appendChild(link);
  }
}

customElements.define('deck-card', DeckCard);

function displayDecks() {
  // First, clear the content
  deckCardsContainer.textContent = '';

  getDecksInfo(db, (decks) => {
    decks.forEach(element => {
      const { deckName, id } = element;

      const card = document.createElement('deck-card');
      card.setAttribute('deck-name', deckName);
      card.setAttribute('deck-id', id);

      deckCardsContainer.appendChild(card);
    });
  });
};

form.addEventListener('submit', addDeck);

function addDeck(e) {
  // We don't want the form to submit normally
  e.preventDefault();
  // Grab the values entered into the form fields
  const newItem = { deckName: deck.value };
  // Open a read/write DB transaction for adding the data
  const transaction = db.transaction([DECKS_STORE_NAME], 'readwrite');
  // Update with new deck
  transaction.oncomplete = displayDecks;
  // Handler for any unexpected error
  transaction.onerror = () => {
    // Clear the form
    deck.value = '';
    displayActionFailure(output, 'There is already a deck with this name. Please choose another name.');
  };
  
  const deckStore = transaction.objectStore(DECKS_STORE_NAME);

  // Make a request to add our newItem object to the object store
  const objectStoreRequest = deckStore.add(newItem);
  objectStoreRequest.onsuccess = () => {
    // Clear the form since we prevent defualt
    deck.value = '';
    dialog.close();
  };
};

dialogCancel.addEventListener('click', (e) => {
  e.preventDefault();
  dialog.close();
});

plusButton.addEventListener('click', () =>  dialog.showModal());