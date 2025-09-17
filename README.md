# Animate When Visible

![npm](https://img.shields.io/npm/v/animate-when-visible)
![downloads](https://img.shields.io/npm/dm/animate-when-visible)
![license](https://img.shields.io/npm/l/animate-when-visible)

A tiny (2KB), no-dependency JavaScript library that adds a class to elements when they become visible, letting you control animations with CSS. Optionally, automatically add staggered timing between elements.

There are no default animations included, you define them yourself in CSS.

Example: https://animate-when-visible-example.netlify.app/

## Features

- Adds a class to elements when they enter the viewport
- Supports **staggered** and **slow-staggered** animations with automatic transition delays
- Includes sorting logic so that staggered animations fire based on their order in the DOM
- Optionally handles **dynamically added content** via MutationObserver
- Provides an optional callback function for each intersection
- Provides lifecycle methods: `destroy()` and `refresh()`
- Lightweight, no dependencies

## Why another scroll animation library?

Because I couldn't find what I wanted in the existing options.

Most existing animation libraries are either:

- **Heavy**: They add a lot of extra JavaScript and CSS that aren’t necessary for simple visibility-triggered animations.
- **Outdated**: Many are based on scroll listeners, which can be detrimental to peformance. This library uses **IntersectionObserver** and **requestAnimationFrame** to ensure light and performant effects.
- **Opinionated**: They come bundled with animations that don't fit your design, and often look clunky.

`animate-when-visible`:

- Provides the **essential logic** for visibility detection and staggered timing.
- Leaves the animation as part of the CSS presentation layer.
- Makes staggered animations dead simple with built-in delay handling.

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
animateWhenVisible();
```

By default, all elements with the .awv-animate class will have the configured animationClass added when they become visible.

---

### 3. Options

You can pass an options object:

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
  observeMutations: false,
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
| `observeMutations`         | Boolean  | `false`                    | Observe dynamically added elements           |
| `animateOnScrollDownOnly`  | Boolean  | `false`                    | Only animate when scrolling down             |

---

### 4. Destroy / Refresh

```javascript
import { destroy, refresh } from 'animate-when-visible';
```

```javascript
// Stop observers
destroy();

// Re-observe elements
refresh();
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
  <div class="awv-animate awv-stagger fade-in"></div>
  <div class="awv-animate awv-stagger fade-in"></div>
  <div class="awv-animate awv-stagger fade-in"></div>
</div>
```

- `.awv-stagger-container` groups a set of staggered elements together. This prevents long delays when many elements appear on the screen at once.
- `.awv-stagger` and `.awv-stagger-slow` control the stagger timing.

---

## CSS

Add a transition or animation to your `animationClass`:

```css
/* Fade in + slide up */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-in.awv-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Simple opacity fade */
.fade-in-opacity {
  opacity: 0;
  transition: opacity 1s ease;
}

.fade-in-opacity.awv-visible {
  opacity: 1;
}
```

- **Stagger delays are applied dynamically via JS as transition delays**, so you don’t need to write CSS for each element.

---

## Browser Support

- Modern browsers with **IntersectionObserver support**.
- Polyfills required for IE11 and older browsers.

---

## Example

See the `example` directory for a working demo with staggered and slow-staggered animations.
