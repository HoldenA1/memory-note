export const
  CARDS_STORE_NAME = 'flashcards',
  DECKS_STORE_NAME = 'decks';

const DB_NAME = 'omoidasu-noto-db';
const DB_VERSION = 1; // Use an integer


/**
 * Handles creation of the database if it doesn't exist
 * Use the on success callback to access the database
 * @param {function} onsuccess
 * @param {function} onerror
 */
function openDb(onsuccess, onerror) {
  let req = indexedDB.open(DB_NAME, DB_VERSION);
  
  req.onerror = onerror;
  req.onsuccess = onsuccess;
  
  req.onupgradeneeded = function (event) {
    let db = event.target.result;
    
    // Create flashcards objectStore for this database
    const cardStore = db.createObjectStore(CARDS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    cardStore.createIndex('term', 'term', { unique: false });
    cardStore.createIndex('defn', 'defn', { unique: false });
    cardStore.createIndex('deckId', 'deckId', { unique: false });
  
    // Create deck objectStore for this database
    const deckStore = db.createObjectStore(DECKS_STORE_NAME, { keyPath: "id", autoIncrement: true });
    deckStore.createIndex('deckName', 'deckName', { unique: true });
  };
}

/**
 * Adds the given term/definition pair into the flashcards store
 * @param {IDBDatabase} db
 * @param {string} term
 * @param {string} defn
 * @param {number} deckId
 * @param {function} onsuccess
 * @param {function} onerror
 */
function saveFlashcard(db, term, defn, deckId, onsuccess, onerror) {
  let obj = { term: term, defn: defn, deckId: deckId };

  let tx = db.transaction(CARDS_STORE_NAME, 'readwrite');
  let store = tx.objectStore(CARDS_STORE_NAME);
  let req = store.add(obj);
  req.onsuccess = onsuccess;
  req.onerror = onerror;
}

/**
 * Returns a JS object with everything in the decks store
 * @param {IDBDatabase} db 
 * @param {function} callback 
 */
function getDecksInfo(db, callback) {
  const objectStore = db.transaction(DECKS_STORE_NAME).objectStore(DECKS_STORE_NAME);
  const decks = [];
  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      decks.push(cursor.value);
      cursor.continue();
    } else {
      callback(decks);
    }
  };
}

/**
 * Helper function that adds a fade out to notifications
 * @param {HTMLElement} el 
 * @param {string} message 
 */
function displayMessage(el, message) {
  el.innerText = message;
  el.style.opacity = 1;
  setTimeout(function() {
      el.style.opacity = 0;
  }, 3000);
}

/**
 * This function takes a notification element, gives it failure styling,
 * displays the given message, and has it fade away after 3 seconds.
 * @param {HTMLElement} el 
 * @param {string} message 
 */
function displayActionFailure(el, message) {
  el.classList.remove('success');
  el.classList.add('fail');
  displayMessage(el, message);
}

/**
 * This function takes a notification element, gives it success styling,
 * displays the given message, and has it fade away after 3 seconds.
 * @param {HTMLElement} el 
 * @param {string} message 
 */
function displayActionSuccess(el, message) {
  el.classList.remove('fail');
  el.classList.add('success');
  displayMessage(el, message);
}

export { openDb, getDecksInfo, saveFlashcard, displayActionFailure, displayActionSuccess };