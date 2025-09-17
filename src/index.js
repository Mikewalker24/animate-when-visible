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
export default function animateWhenVisible(options = {}) {
  const cfg = {
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

  const elementIndex = new Map();
  let orderCounter = 0;
  const staggeredCountByContainer = new Map();
  let lastScrollY = window.scrollY;

  function handleIntersect(entries) {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => elementIndex.get(a.target) - elementIndex.get(b.target))
      .forEach((entry) => {
        if (cfg.animateOnScrollDownOnly && !scrollingDown) return;

        const el = entry.target;
        const hasStagger =
          el.classList.contains(cfg.staggerClass) ||
          el.classList.contains(cfg.staggerSlowClass);

        if (!hasStagger) {
          animateImmediate(el);
          return;
        }

        const container = getStaggerContainer(el);
        animateWithStagger(el, container);
      });
  }

  const observer = new IntersectionObserver(handleIntersect, {
    threshold: cfg.threshold,
  });

  function observeElements(els) {
    els.forEach((el) => {
      if (!elementIndex.has(el)) elementIndex.set(el, orderCounter++);
      observer.observe(el);
    });
  }

  observeElements(document.querySelectorAll(cfg.targetSelector));

  let mutationObserver;
  if (cfg.observeMutations) {
    mutationObserver = new MutationObserver(function handleMutations(
      mutations
    ) {
      const newEls = new Set();
      mutations.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches(cfg.targetSelector)) newEls.add(n);
          else
            n.querySelectorAll(cfg.targetSelector).forEach((child) =>
              newEls.add(child)
            );
        })
      );
      if (newEls.size) observeElements([...newEls]);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  function getStaggerContainer(el) {
    return (
      el.closest(cfg.staggerContainerSelector) ||
      el.closest('section') ||
      el.closest('nav') ||
      document.body
    );
  }

  function getStaggerDelay(el, container) {
    const animatedCount = staggeredCountByContainer.get(container) ?? 0;

    if (el.classList.contains(cfg.staggerSlowClass)) {
      return `${animatedCount * cfg.staggerDelaySlow}ms`;
    }
    if (el.classList.contains(cfg.staggerClass)) {
      return `${animatedCount * cfg.staggerDelay}ms`;
    }
    return '0ms';
  }

  function animateImmediate(el) {
    el.classList.add(cfg.animationClass);
    if (typeof cfg.onVisible === 'function') cfg.onVisible(el);
    observer.unobserve(el);
  }

  function animateWithStagger(el, container) {
    if (!staggeredCountByContainer.has(container)) {
      staggeredCountByContainer.set(container, 0);
    }

    const delay = getStaggerDelay(el, container);

    requestAnimationFrame(() => {
      el.style.transitionDelay = delay;
      el.classList.add(cfg.animationClass);

      el.addEventListener(
        'transitionend',
        () => (el.style.transitionDelay = '0ms'),
        { once: true }
      );

      if (typeof cfg.onVisible === 'function') cfg.onVisible(el);
    });

    staggeredCountByContainer.set(
      container,
      staggeredCountByContainer.get(container) + 1
    );
    observer.unobserve(el);
  }

  return {
    destroy() {
      observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    },
    refresh() {
      observeElements(document.querySelectorAll(cfg.targetSelector));
    },
  };
}
