import { DB_NAME, DB_VERSION, DB_STORE_NAME,
  openDb } from './database.js';

class CardContents extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create spans
    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    const info = document.createElement("span");
    info.setAttribute("class", "info");

    // Take attribute content and put it inside the info span
    const text = this.getAttribute("data-text");
    info.textContent = text;

    // Insert icon
    let imgUrl;
    if (this.hasAttribute("img")) {
      imgUrl = this.getAttribute("img");
    } else {
      imgUrl = "img/default.png";
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    icon.appendChild(img);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: relative;
      }

      .info {
        font-size: 0.8rem;
        width: 200px;
        display: inline-block;
        border: 1px solid black;
        padding: 10px;
        background: white;
        border-radius: 10px;
        opacity: 0;
        transition: 0.6s all;
        position: absolute;
        bottom: 20px;
        left: 10px;
        z-index: 3;
      }

      img {
        width: 1.2rem;
      }

      .icon:hover + .info, .icon:focus + .info {
        opacity: 1;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(info);
  }
}

function populateCards(evt) {
  let tx = this.result.transaction(DB_STORE_NAME, 'readwrite');
  let store = tx.objectStore(DB_STORE_NAME);
  let req = store.getAll();
  req.onsuccess = function(evt) {
    cards = req.result;
    const container = document.getElementById('cards');
    for (let i = 0; i < cards.length; i++) {
      const cardEl = document.createElement('div');
      const termEl = document.createElement('p');
      const defnEl = document.createElement('p');
      termEl.innerText = `term: ${cards[i].term}`;
      defnEl.innerText = `defn: ${cards[i].defn}`;
      cardEl.appendChild(termEl);
      cardEl.appendChild(defnEl);
      container.appendChild(cardEl);
    }
  };
  req.onerror = function() {
    console.error("add error", this.error);
  };
}

openDb(DB_NAME, DB_VERSION, DB_STORE_NAME, populateCards);