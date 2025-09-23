import animateWhenVisible from './lib/index.js';

// Initialize the animator
const animator = animateWhenVisible({
  observeMutations: true,
  onVisible: (el) => {
    console.log('Animated:', el);
  },
});

const addItemsButton = document.getElementById('add-items');
const newItemsContainer = document.getElementById('new-items-container');

function createStaggerItem() {
  const item = document.createElement('div');
  item.className = 'small-item fade-in awv-animate awv-stagger';
  return item;
}

function createStaggerRow(count = 5) {
  const row = document.createElement('div');
  row.className = 'row awv-stagger-container';
  for (let i = 0; i < count; i++) {
    row.appendChild(createStaggerItem());
  }
  return row;
}

addItemsButton.addEventListener('click', () => {
  const newRow = createStaggerRow(5);
  newItemsContainer.appendChild(newRow);
});
