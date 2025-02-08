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
    db = event.target.result;
    
    // Create flashcards objectStore for this database
    const cardStore = db.createObjectStore(CARDS_STORE_NAME, { keyPath: 'id', autoIncrement: true });
    cardStore.createIndex('term', 'term', { unique: false });
    cardStore.createIndex('defn', 'defn', { unique: false });
    cardStore.createIndex('deckIdIndex', 'deckId', { unique: false });
  
    // Create deck objectStore for this database
    const deckStore = db.createObjectStore(DECKS_STORE_NAME, { keyPath: "id", autoIncrement: true });
    deckStore.createIndex('deckName', 'deckName', { unique: true });
  };
}

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

export { openDb, getDecksInfo };