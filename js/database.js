export const
  DB_NAME = 'omoidasu-noto-db',
  DB_VERSION = 1, // Use a long long for this value (don't use a float)
  DB_STORE_NAME = 'flashcards';

/**
 * @param {string} name
 * @param {number} version
 * @param {string} store_name
 * @param {function} onsuccess
 */
function openDb(name, version, store_name, onsuccess) {
  let req = indexedDB.open(name, version);
  
  req.onerror = function (evt) {
    console.error("openDb:", evt.target.errorCode);
  };
  
  req.onupgradeneeded = function (evt) {
    console.log("openDb.onupgradeneeded");
    let store = evt.currentTarget.result.createObjectStore(
      store_name, { keyPath: 'id', autoIncrement: true });
  
    store.createIndex('term', 'term', { unique: false });
    store.createIndex('defn', 'defn', { unique: false });
  };
  
  req.onsuccess = onsuccess;
}

export { openDb };