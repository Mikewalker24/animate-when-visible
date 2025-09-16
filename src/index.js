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
    observeMutations: true,
    animateOnScrollDownOnly: false,
    ...options,
  };

  const orderMap = new Map();
  let orderCounter = 0;
  const containerCounts = new Map();
  let lastScrollY = window.scrollY;

  const observer = new IntersectionObserver(
    (entries) => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      lastScrollY = currentScrollY;

      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => orderMap.get(a.target) - orderMap.get(b.target))
        .forEach((entry) => {
          if (cfg.animateOnScrollDownOnly && !scrollingDown) return;

          const el = entry.target;
          const container =
            el.closest(cfg.staggerContainerSelector) ||
            el.closest('section') ||
            el.closest('nav') ||
            document.body;

          if (!containerCounts.has(container))
            containerCounts.set(container, 0);
          const count = containerCounts.get(container);
          const prevVisible = container.querySelectorAll(
            `.${cfg.animationClass}`
          ).length;

          const delay = el.classList.contains(cfg.staggerSlowClass)
            ? `${(count - prevVisible) * cfg.staggerDelaySlow}ms`
            : el.classList.contains(cfg.staggerClass)
            ? `${(count - prevVisible) * cfg.staggerDelay}ms`
            : '0ms';

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

          containerCounts.set(container, count + 1);
          observer.unobserve(el);
        });
    },
    { threshold: cfg.threshold }
  );

  const observeElements = (els) => {
    els.forEach((el) => {
      if (!orderMap.has(el)) orderMap.set(el, orderCounter++);
      observer.observe(el);
    });
  };

  observeElements(document.querySelectorAll(cfg.targetSelector));

  let mutationObserver;
  if (cfg.observeMutations) {
    mutationObserver = new MutationObserver((mutations) => {
      const newEls = [];
      mutations.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches(cfg.targetSelector)) newEls.push(n);
          else newEls.push(...n.querySelectorAll(cfg.targetSelector));
        })
      );
      if (newEls.length) observeElements(newEls);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
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
