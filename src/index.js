/**
 * animateWhenVisible
 * Adds a class to elements when they enter the viewport, with optional stagger and scroll-direction support.
 *
 * @param {Object} options Configuration options
 * @param {number} options.threshold IntersectionObserver threshold
 * @param {number} options.staggerDelay Delay in ms for staggered elements
 * @param {number} options.staggerDelaySlow Delay in ms for slow staggered elements
 * @param {string} options.animationClass Class to add when visible
 * @param {string} options.staggerClass Class that marks elements to stagger
 * @param {string} options.staggerSlowClass Class that marks elements for slow stagger
 * @param {string} options.targetSelector CSS selector for target elements
 * @param {string} options.staggerContainerSelector Class or selector for stagger containers
 * @param {Function} options.onVisible Callback function called when element becomes visible
 * @param {boolean} options.observeMutations Whether to observe dynamically added elements
 * @param {boolean} options.animateOnScrollDownOnly Only animate when scrolling down
 */

let currentObserver;
let currentMutationObserver;
let currentCfg;
let elementIndex = new Map();
let orderCounter = 0;
let staggeredCountByContainer = new Map();
let lastScrollY = window.scrollY;

function handleIntersect(entries) {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;
  lastScrollY = currentScrollY;

  entries
    .filter((e) => e.isIntersecting)
    .sort((a, b) => elementIndex.get(a.target) - elementIndex.get(b.target))
    .forEach((entry) => {
      if (currentCfg.animateOnScrollDownOnly && !scrollingDown) return;

      const el = entry.target;
      const hasStagger =
        el.classList.contains(currentCfg.staggerClass) ||
        el.classList.contains(currentCfg.staggerSlowClass);

      if (!hasStagger) {
        animateImmediate(el);
        return;
      }

      const container = getStaggerContainer(el);
      animateWithStagger(el, container);
    });
}

function observeElements(els) {
  els.forEach((el) => {
    if (!elementIndex.has(el)) elementIndex.set(el, orderCounter++);
    currentObserver.observe(el);
  });
}

function getStaggerContainer(el) {
  return (
    el.closest(currentCfg.staggerContainerSelector) ||
    el.closest('section') ||
    el.closest('nav') ||
    document.body
  );
}

function getStaggerDelay(el, container) {
  const animatedCount = staggeredCountByContainer.get(container) ?? 0;

  if (el.classList.contains(currentCfg.staggerSlowClass)) {
    return `${animatedCount * currentCfg.staggerDelaySlow}ms`;
  }
  if (el.classList.contains(currentCfg.staggerClass)) {
    return `${animatedCount * currentCfg.staggerDelay}ms`;
  }
  return '0ms';
}

function animateImmediate(el) {
  el.classList.add(currentCfg.animationClass);
  if (typeof currentCfg.onVisible === 'function') currentCfg.onVisible(el);
  currentObserver.unobserve(el);
}

function animateWithStagger(el, container) {
  if (!staggeredCountByContainer.has(container)) {
    staggeredCountByContainer.set(container, 0);
  }

  const delay = getStaggerDelay(el, container);

  requestAnimationFrame(() => {
    el.style.transitionDelay = delay;
    el.classList.add(currentCfg.animationClass);

    el.addEventListener(
      'transitionend',
      () => (el.style.transitionDelay = '0ms'),
      { once: true }
    );

    if (typeof currentCfg.onVisible === 'function') currentCfg.onVisible(el);
  });

  staggeredCountByContainer.set(
    container,
    staggeredCountByContainer.get(container) + 1
  );
  currentObserver.unobserve(el);
}

export default function animateWhenVisible(options = {}) {
  currentCfg = {
    threshold: 0.1,
    staggerDelay: 100,
    staggerDelaySlow: 250,
    animationClass: 'awv-visible',
    staggerClass: 'awv-stagger',
    staggerSlowClass: 'awv-stagger-slow',
    targetSelector: '.awv-animate',
    staggerContainerSelector: '.awv-stagger-container',
    onVisible: null,
    observeMutations: false,
    animateOnScrollDownOnly: false,
    ...options,
  };

  elementIndex = new Map();
  orderCounter = 0;
  staggeredCountByContainer = new Map();
  lastScrollY = window.scrollY;

  currentObserver = new IntersectionObserver(handleIntersect, {
    threshold: currentCfg.threshold,
  });

  observeElements(document.querySelectorAll(currentCfg.targetSelector));

  if (currentCfg.observeMutations) {
    currentMutationObserver = new MutationObserver(function handleMutations(
      mutations
    ) {
      const newEls = new Set();
      mutations.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches(currentCfg.targetSelector)) newEls.add(n);
          else
            n.querySelectorAll(currentCfg.targetSelector).forEach((child) =>
              newEls.add(child)
            );
        })
      );
      if (newEls.size) observeElements([...newEls]);
    });
    currentMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

export function destroy() {
  if (currentObserver) currentObserver.disconnect();
  if (currentMutationObserver) currentMutationObserver.disconnect();
}

export function refresh() {
  if (currentObserver)
    observeElements(document.querySelectorAll(currentCfg.targetSelector));
}
