export interface AnimateWhenVisibleOptions {
  threshold?: number;
  staggerDelay?: number;
  staggerDelaySlow?: number;
  animationClass?: string;
  staggerClass?: string;
  staggerSlowClass?: string;
  targetSelector?: string;
  staggerContainerSelector?: string;
  onVisible?: (el: HTMLElement) => void;
  observeMutations?: boolean;
  animateOnScrollDownOnly?: boolean;
}

export default function animateWhenVisible(
  options?: AnimateWhenVisibleOptions
): {
  destroy(): void;
  refresh(): void;
};
