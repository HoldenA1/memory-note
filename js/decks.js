// import { DB_NAME, DB_VERSION, DB_STORE_NAME, openDb } from './database.js';

const dialog = document.getElementById("new-deck-dialog");

// class DeckCard extends HTMLElement {
//   constructor() {
//     // Always call super first in constructor
//     super();
//   }

//   connectedCallback() {
//     // Create a shadow root
//     const shadow = this.attachShadow({ mode: "open" });

//     // Create spans
//     const wrapper = document.createElement("span");
//     wrapper.setAttribute("class", "wrapper");

//     const icon = document.createElement("span");
//     icon.setAttribute("class", "icon");
//     icon.setAttribute("tabindex", 0);

//     const info = document.createElement("span");
//     info.setAttribute("class", "info");

//     // Take attribute content and put it inside the info span
//     const text = this.getAttribute("data-text");
//     info.textContent = text;

//     // Attach the created elements to the shadow dom
//     shadow.appendChild(wrapper);
//     wrapper.appendChild(icon);
//     wrapper.appendChild(info);
//   }
// }

// function populateCards(evt) {
//   let tx = this.result.transaction(DB_STORE_NAME, 'readwrite');
//   let store = tx.objectStore(DB_STORE_NAME);
//   let req = store.getAll();
//   req.onsuccess = function(evt) {
//     cards = req.result;
//     const container = document.getElementById('cards');
//     for (let i = 0; i < cards.length; i++) {
//       const cardEl = document.createElement('div');
//       const termEl = document.createElement('p');
//       const defnEl = document.createElement('p');
//       termEl.innerText = `term: ${cards[i].term}`;
//       defnEl.innerText = `defn: ${cards[i].defn}`;
//       cardEl.appendChild(termEl);
//       cardEl.appendChild(defnEl);
//       container.appendChild(cardEl);
//     }
//   };
//   req.onerror = function() {
//     console.error("add error", this.error);
//   };
// }

// openDb(DB_NAME, DB_VERSION, DB_STORE_NAME, populateCards);

document.getElementById("create-deck").addEventListener("click", () => {
  dialog.showModal();
});