// All UI elements we need for the app
const form = document.querySelector('form');
const dialog = document.getElementById('new-deck-dialog');
const dialogCancel = document.getElementById('new-cancel-but')
const plusButton = document.getElementById('create-deck');
const deck = document.getElementById('deckName');
const deckCardsContainer = document.getElementById('deck-cards');
const output = document.querySelector('output');

class DeckCard extends HTMLElement {
  static get observedAttributes() {
    return ['data-location'];
  }

  constructor() {
    super();

    this.link = null;
  }

  /**
   * Helper function to update the style of each card
   * @param {string} location top, bottom, or middle
   */
  updateStyle(location) {
    if (location === 'top') {
      this.link.style = 'border-top-right-radius: 20px;border-top-left-radius: 20px;border-bottom: 1px solid var(--underline);';
    } else if (location === 'bottom') {
      this.link.style = 'border-bottom-right-radius: 20px;border-bottom-left-radius: 20px;';
    } else {
      this.link.style = 'border-bottom: 1px solid var(--underline);';
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.link != null) this.updateStyle(newValue);
  }

  connectedCallback() {
    this.link = document.createElement('a');
    this.link.href = '#';
    this.updateStyle(this.getAttribute('data-location'));

    const p = document.createElement('p');
    p.textContent = this.getAttribute('data-name');
    this.link.appendChild(p);

    const img = document.createElement('img');
    img.src = '../assets/more_icon.svg';
    img.alt = 'options';
    img.title = 'options';
    this.link.appendChild(img);

    this.appendChild(this.link);
  }
}

customElements.define('deck-card', DeckCard);

form.addEventListener('submit', addDeck);

function addDeck(e) {
  // We don't want the form to submit normally
  e.preventDefault();

  deckCardsContainer.firstElementChild.removeAttribute('data-location');
  
  // Add new deck
  const card = document.createElement('deck-card');
  card.setAttribute('data-name', deck.value);
  deckCardsContainer.insertBefore(card, deckCardsContainer.firstChild);

  card.setAttribute('data-location', 'top');
  
  // Clear the form since we prevent defualt
  deck.value = '';

  dialog.close();
};

dialogCancel.addEventListener('click', (e) => {
  e.preventDefault();
  dialog.close();
});

plusButton.addEventListener('click', () =>  document.getElementById('deck-options-dialog').showModal());//dialog.showModal());

output.addEventListener('transitionend', () => {
  output.style.display = 'none';
});