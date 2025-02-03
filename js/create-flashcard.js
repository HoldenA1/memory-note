import { DB_NAME, DB_VERSION, DB_STORE_NAME, openDb } from './database.js';

let db;

/**
 * @param {IDBDatabase} db
 * @param {string} store_name
 * @param {string} term
 * @param {string} defn
 * @param {function} displayActionSuccess
 * @param {function} displayActionFailure
 */
function saveFlashcard(db, store_name, term, defn, actionSuccess, actionFailure) {
  let obj = { term: term, defn: defn };

  let tx = db.transaction(store_name, 'readwrite');
  let store = tx.objectStore(store_name);
  let req;
  try {
    req = store.add(obj);
  } catch (e) {
    throw e;
  }
  req.onsuccess = actionSuccess();
  req.onerror = function() {
    console.error("add error", this.error);
    actionFailure();
  };
}

function displayActionSuccess() {
  let output = document.querySelector('output');
  output.innerText = 'Card successfully submitted';
  output.classList.remove('fail');
  output.classList.add('success');
  output.style.opacity = 1;
  setTimeout(function() {
      output.style.opacity = 0;
  }, 3000);
  document.querySelector('form').reset();
}

function displayActionFailure() {
  let output = document.querySelector('output');
  output.innerText = 'Card submission failed';
  output.classList.remove('success');
  output.classList.add('fail');
  output.style.opacity = 1;
  setTimeout(function() {
      output.style.opacity = 0;
  }, 3000);
}

function createFlashcard(event) {
  event.preventDefault();
  const formData = new FormData(document.querySelector('form'));
  saveFlashcard(db, DB_STORE_NAME, formData.get('term').trim(),
    formData.get('definition').trim(), displayActionSuccess,
    displayActionFailure);
}

function addEventListeners() {
  const form = document.querySelector('form');
  form.addEventListener('submit', createFlashcard);
}

openDb(DB_NAME, DB_VERSION, DB_STORE_NAME, function (evt) {
  db = this.result;
});
addEventListeners();