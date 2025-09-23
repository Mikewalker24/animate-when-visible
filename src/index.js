export default function animateWhenVisible({
  threshold = 0.1,
  staggerDelay = 100,
  staggerDelaySlow = 250,
  targetSelector = '.awv-animate',
  animationClass = 'awv-visible',
  staggerClass = 'awv-stagger',
  staggerSlowClass = 'awv-stagger-slow',
  staggerContainerSelector = '.awv-stagger-container',
  onVisible = null,
  observeMutations = false,
  animateOnScrollDownOnly = false,
} = {}) {
  // Map target elements to their insertion order
  const elementIndex = new Map();
  let orderCounter = 0;

  // Track number of staggered elements per container to calculate delays
  const staggeredCountByContainer = new Map();

  // Used to detect scroll direction
  let lastScrollY = window.scrollY;

  // Get the nearest container for staggering, or fallback to common parent elements
  const getStaggerContainer = (el) =>
    el.closest(staggerContainerSelector) ||
    el.closest('section') ||
    el.closest('nav') ||
    document.body;

  // Calculate delay based on how many elements in container have already animated
  function getStaggerDelay(el, container) {
    const count = staggeredCountByContainer.get(container) ?? 0;
    if (el.classList.contains(staggerSlowClass))
      return `${count * staggerDelaySlow}ms`;
    if (el.classList.contains(staggerClass))
      return `${count * staggerDelay}ms`;
    return '0ms';
  }

  // Animate element immediately
  function animateImmediate(el) {
    el.classList.add(animationClass);
    onVisible?.(el);
    observer.unobserve(el);
  }

  // Animate element with staggered delay
  function animateWithStagger(el, container) {
    // Seed the counter with how many are already visible in this container
    if (!staggeredCountByContainer.has(container)) {
      const alreadyVisible = container.querySelectorAll(`.${animationClass}`).length;
      staggeredCountByContainer.set(container, alreadyVisible);
    }

    const delay = getStaggerDelay(el, container);
    el.style.transitionDelay = delay;
    el.classList.add(animationClass);

    // Reset delay after transition ends
    el.addEventListener(
      'transitionend',
      () => {
        el.style.transitionDelay = '0ms';
      },
      { once: true }
    );

    onVisible?.(el);

    // Increment count for container
    staggeredCountByContainer.set(
      container,
      staggeredCountByContainer.get(container) + 1
    );

    observer.unobserve(el);
  }

  // IntersectionObserver callback
  function handleIntersect(entries) {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    entries
      .filter((e) => e.isIntersecting) // Only handle visible elements
      .sort((a, b) => elementIndex.get(a.target) - elementIndex.get(b.target)) // Maintain insertion order
      .forEach((entry) => {
        if (animateOnScrollDownOnly && !scrollingDown) return;

        const el = entry.target;
        const isStaggered =
          el.classList.contains(staggerClass) ||
          el.classList.contains(staggerSlowClass);
        if (!isStaggered) return animateImmediate(el);

        const container = getStaggerContainer(el);
        animateWithStagger(el, container);
      });
  }

  // Create observer
  const observer = new IntersectionObserver(handleIntersect, {
    threshold,
  });

  // Observe elements and assign order index
  function observeElements(els) {
    for (const el of els) {
      if (!elementIndex.has(el)) elementIndex.set(el, orderCounter++);
      observer.observe(el);
    }
  }

  // Start observing initial elements
  observeElements(document.querySelectorAll(targetSelector));

  // Optionally observe dynamically added elements
  let mutationObserver;
  if (observeMutations) {
    mutationObserver = new MutationObserver((mutations) => {
      const newElements = new Set();
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue; // Only element nodes
          if (node.matches(targetSelector)) newElements.add(node);
          else
            node
              .querySelectorAll(targetSelector)
              .forEach((child) => newElements.add(child));
        }
      }
      if (newElements.size) observeElements([...newElements]);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  // Reset counts by seeding from already-visible elements in each container
  function reseedStaggerCounts() {
    staggeredCountByContainer.clear();
    document.querySelectorAll(staggerContainerSelector).forEach((container) => {
      const alreadyVisible = container.querySelectorAll(`.${animationClass}`).length;
      staggeredCountByContainer.set(container, alreadyVisible);
    });
  }

  // Return API to destroy observers or refresh element list
  return {
    destroy: () => {
      observer.disconnect();
      mutationObserver?.disconnect();
    },
    refresh: () => {
      reseedStaggerCounts();
      observeElements(document.querySelectorAll(targetSelector));
    },
  };
}
