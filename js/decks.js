const DB_NAME = 'omoidasu-noto-db';
const DB_VERSION = 1; // Use a long long for this value (don't use a float)
const CARDS_STORE_NAME = 'flashcards';
const DECKS_STORE_NAME = 'decks';

// All UI elements we need for the app
const form = document.querySelector('form');
const dialog = document.getElementById('new-deck-dialog');
const dialogCancel = document.getElementById('cancel')
const plusButton = document.getElementById('create-deck');
const deck = document.getElementById('deckName');
const deckCardsContainer = document.getElementById('deck-cards');


// Hold an instance of a db object for us to store the IndexedDB data in
let db;

console.log('App initialized.');

// Let us open our database
const DBOpenRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

// Register two event handlers to act on the database being opened successfully, or not
DBOpenRequest.onerror = (event) => {
  console.error('Error loading database.');
};

DBOpenRequest.onsuccess = (event) => {
  console.log('Database initialised.');

  // Store the result of opening the database in the db variable. This is used a lot below
  db = DBOpenRequest.result;

  // Populate the data already in the IndexedDB
  displayDecks();
};

// This event handles the event whereby a new version of the database needs to be created
// Either one has not been created before, or a new version number has been submitted via the
// window.indexedDB.open line above
DBOpenRequest.onupgradeneeded = (event) => {
  db = event.target.result;

  db.onerror = (event) => {
    console.error('Error loading database.');
  };

  // Create flashcards objectStore for this database
  const cardStore = db.createObjectStore(CARDS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
  cardStore.createIndex('term', 'term', { unique: false });
  cardStore.createIndex('defn', 'defn', { unique: false });
  cardStore.createIndex('deckIdIndex', 'deckId', { unique: false });

  // Create deck objectStore for this database
  const deckStore = db.createObjectStore(DECKS_STORE_NAME, { keyPath: "id", autoIncrement: true });
  deckStore.createIndex('deckName', 'deckName', { unique: true });
  
  console.log('Object stores created.');  
};

function displayDecks() {
  // First clear the content
  deckCardsContainer.chil
  while (deckCardsContainer.firstChild) {
    deckCardsContainer.removeChild(deckCardsContainer.lastChild);
  }

  // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
  const objectStore = db.transaction(DECKS_STORE_NAME).objectStore(DECKS_STORE_NAME);
  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    // Check if there are no (more) cursor items to iterate through
    if (!cursor) {
      // No more items to iterate through, we quit.
      console.log('Entries all displayed.');
      return;
    }

    const { deckName, id } = cursor.value;

    // Build the entry and put it into the list item.
    const listItem = document.createElement('p');
    listItem.textContent = `${deckName} — ${id}`;

    // Put the item item inside the task list
    deckCardsContainer.appendChild(listItem);

    // continue on to the next item in the cursor
    cursor.continue();
  };
};

form.addEventListener('submit', addDeck);

function addDeck(e) {
  // Prevent default, as we don't want the form to submit in the conventional way
  e.preventDefault();
  
  // Grab the values entered into the form fields and store them in an object ready for being inserted into the IndexedDB
  const newItem = { deckName: deck.value };

  // Open a read/write DB transaction, ready for adding the data
  const transaction = db.transaction([DECKS_STORE_NAME], 'readwrite');

  // Report on the success of the transaction completing, when everything is done
  transaction.oncomplete = () => {
    console.log('Transaction completed: database modification finished.');

    // Update the display of data to show the newly added item.
    displayDecks();
  };

  // Handler for any unexpected error
  transaction.onerror = () => {
    console.error(`Transaction not opened due to error: ${transaction.error}`);
  };

  // Call an object store that's already been added to the database
  const deckStore = transaction.objectStore(DECKS_STORE_NAME);

  // Make a request to add our newItem object to the object store
  const objectStoreRequest = deckStore.add(newItem);
  objectStoreRequest.onsuccess = (event) => {

    // Report the success of our request
    // (to detect whether it has been succesfully
    // added to the database, you'd look at transaction.oncomplete)
    console.log('Request successful.');

    // Clear the form, ready for adding the next entry
    deck.value = '';
    dialog.close();
  };
};


dialogCancel.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('close event');
  dialog.close();
});
plusButton.addEventListener('click', () =>  dialog.showModal());