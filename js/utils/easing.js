/**
 * Easing Functions - Inspired from http://gizma.com/easing/,
 * only considering the t value for the range [0, 1] => [0, 1].
 * @type {Object}
 */
var Easing = {
  // No easing, no acceleration.
  linear: function(t) {
    return t;
  },
  // Accelerating from zero velocity.
  easeInQuad: function(t) {
    return t * t;
  },
  // Decelerating to zero velocity.
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  // Acceleration until halfway, then deceleration.
  easeInOutQuad: function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // Accelerating from zero velocity.
  easeInCubic: function(t) {
    return t * t * t;
  },
  // Decelerating to zero velocity.
  easeOutCubic: function(t) {
    return (--t) * t * t + 1;
  },
  // Acceleration until halfway, then deceleration.
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // Accelerating from zero velocity.
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  // Decelerating to zero velocity.
  easeOutQuart: function(t) {
    return 1 - (--t) * t * t * t;
  },
  // Acceleration until halfway, then deceleration.
  easeInOutQuart: function(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  // Accelerating from zero velocity.
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  // Decelerating to zero velocity.
  easeOutQuint: function(t) {
    return 1 + (--t) * t * t * t * t;
  },
  // Acceleration until halfway, then deceleration.
  easeInOutQuint: function(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
};
