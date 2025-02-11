import { openDb, getDecksInfo, saveFlashcard, displayActionFailure, displayActionSuccess } from './database.js';

const parsedUrl = new URL(window.location.href);
const deckSel = document.getElementById('deck-select');
const deckId = parsedUrl.searchParams.get('deck');
const form = document.querySelector('form');
const output = document.querySelector('output');
const termInput = document.getElementById('term');
const defnInput = document.getElementById('definition');

// Hold an instance of a db object
let db;

function onerror() {
  console.error('Error loading database.');
};

function onsuccess(event) {
  // Store the result of opening the database in the db variable
  db = event.target.result;

  getDecksInfo(db, (decks) => {
    if (deckId != null) deckSel.textContent = '';
    
    decks.forEach(element => {
      const { deckName, id } = element;

      const option = document.createElement('option');
      option.textContent = deckName;
      option.setAttribute('value', id)

      if (deckId != null && deckId == id) option.setAttribute('selected', 'selected');

      deckSel.appendChild(option);
    });
  });
};

// Open the database and get our db instance
openDb(onsuccess, onerror);

function createFlashcard(event) {
  event.preventDefault();
  const formData = new FormData(form);
  saveFlashcard(
    db,
    formData.get('term').trim(),
    formData.get('definition').trim(),
    parseInt(formData.get('deck-select')),
    () => displayActionSuccess(output, 'Card successfully submitted.'),
    () => displayActionFailure(output, 'Card submission failed.')
  );
  termInput.value = '';
  defnInput.value = '';
  termInput.focus();
}

form.addEventListener('submit', createFlashcard);

/* 
This removes the output from the DOM render tree so
it doesn't cover clickable elements after it is hidden.
I'd like to find a cleaner way to do this so it doesn't
stay here.
*/
output.addEventListener("transitionend", () => {
    output.style.display = 'none';
});