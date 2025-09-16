import animateWhenVisible from './lib/index.js';

// Initialize the animator
const animator = animateWhenVisible({
  threshold: 0.2,
  staggerDelay: 100,
  staggerDelaySlow: 300,
  observeMutations: true,
  onVisible: (el) => {
    console.log('Animated:', el);
  },
});

// Optionally, stop observing when needed
// animator.destroy();

const addItemsButton = document.getElementById('add-items');
const newItemsContainer = document.getElementById('new-items-container');

function createStaggerItem() {
  const item = document.createElement('div');
  item.className = 'stagger-item awv-animate awv-stagger';
  return item;
}

function createStaggerRow(count = 5) {
  const row = document.createElement('div');
  row.className = 'stagger-row awv-stagger-container';
  for (let i = 0; i < count; i++) {
    row.appendChild(createStaggerItem());
  }
  return row;
}

addItemsButton.addEventListener('click', () => {
  const newRow = createStaggerRow(5);
  newItemsContainer.appendChild(newRow);
});
