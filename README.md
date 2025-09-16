# Animate When Visible

![npm](https://img.shields.io/npm/v/animate-when-visible)
![downloads](https://img.shields.io/npm/dm/animate-when-visible)
![license](https://img.shields.io/npm/l/animate-when-visible)

A tiny (2KB), no-dependency JavaScript library that adds classes to elements when they become visible, letting you control animations with CSS.

There are no default animations included. The library performs two main tasks:

- Adds a class to elements when they become visible.
- Dynamically applies transition delays to elements marked for staggered animations.

This approach gives you full control to define your own CSS animations. It supports staggered and slow-staggered elements, optional scroll-direction triggers, and dynamically added content.

---

## Installation

```bash
npm install animate-when-visible
```

---

## Usage

### 1. Import the library

```javascript
import animateWhenVisible from 'animate-when-visible';
```

### 2. Initialize

```javascript
const animator = animateWhenVisible();
```

By default, all elements with the .awv-animate class will have the configured animationClass added when they become visible.

---

### 3. Options

You can pass an options object to customize behavior:

```javascript
const animator = animateWhenVisible({
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
});
```

| Option                     | Type     | Default                    | Description                                  |
| -------------------------- | -------- | -------------------------- | -------------------------------------------- |
| `threshold`                | Number   | `0.1`                      | IntersectionObserver threshold               |
| `staggerDelay`             | Number   | `100`                      | Delay in ms between staggered elements       |
| `staggerDelaySlow`         | Number   | `250`                      | Delay for slow-staggered elements            |
| `animationClass`           | String   | `'awv-visible'`            | Class added when element is visible          |
| `staggerClass`             | String   | `'awv-stagger'`            | Class marking elements for stagger           |
| `staggerSlowClass`         | String   | `'awv-stagger-slow'`       | Class marking elements for slow stagger      |
| `targetSelector`           | String   | `'.awv-animate'`           | CSS selector for elements to animate         |
| `staggerContainerSelector` | String   | `'.awv-stagger-container'` | Selector for staggered element containers    |
| `onVisible`                | Function | `null`                     | Callback called when element becomes visible |
| `observeMutations`         | Boolean  | `true`                     | Observe dynamically added elements           |
| `animateOnScrollDownOnly`  | Boolean  | `false`                    | Only animate when scrolling down             |

---

### 4. Destroy / Refresh

```javascript
// Stop observers
animator.destroy();

// Re-observe elements (useful after dynamically adding content)
animator.refresh();
```

---

## HTML Markup

### Single element

```html
<div class="awv-animate"></div>
```

### Staggered elements

```html
<div class="awv-stagger-container">
  <div class="awv-animate awv-stagger"></div>
  <div class="awv-animate awv-stagger-slow"></div>
  <div class="awv-animate awv-stagger"></div>
</div>
```

- `.awv-stagger-container` is optional if you don’t need staggered delays.
- `.awv-stagger` and `.awv-stagger-slow` control the stagger timing.

---

## CSS

Add a transition or animation to your `animationClass`:

```css
.awv-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.awv-animate.awv-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- **Stagger delays are applied dynamically via JS as transition delays**, so you don’t need to write CSS for each element.

---

## Browser Support

- Modern browsers with **IntersectionObserver support**.
- Polyfills required for IE11 and older browsers.

---

## Example

Example: https://animate-when-visible-example.netlify.app/

See the `example` directory for a working demo with staggered and slow-staggered animations.
