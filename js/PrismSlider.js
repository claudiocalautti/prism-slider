/**
 * The PrismSlider.
 */
var PrismSlider = (function(window, undefined) {

  'use strict';


  /**
   * The PrismSlider.
   * @param {Object} settings The PrismSlider settings.
   * @constructor
   */
  function PrismSlider(settings) {

    /**
     * Get settings object of this instance.
     * @type {Object}
     */
    this.settings = settings;

    /**
     * Store main container DOM element.
     * @type {Element}
     */
    this.container = settings.container.element;

    /**
     * Store array of photos, note that we use slice in order to
     * clone the array and avoid conficts when we'll later replace
     * the image path with the actual JavaScript <img> object.
     * @type {Array}
     */
    this.slides = settings.slides.slice();

    /**
     * Count slides
     * @type {Number}
     */
    this.slidesLength = this.slides.length;

    /**
     * The mask source and effects.
     * @type {Object}
     */
    this.mask = settings.mask;

    /**
     * The sliding duration.
     * @type {Number}
     */
    this.duration = settings.duration;

    /**
     * The global easing function.
     * @type {Object}
     */
    this.easing = settings.easing;

    /**
     * The slides index.
     * @type {Number}
     */
    this.slidesIndex = 0;

    /**
     * The previous slides index, needed to animate through
     * more than one slide.
     * @type {Number}
     */
    this.prevSlidesIndex = 0;

    /**
     * The difference between the prevSlideIndex and slideIndex,
     * needed to animate through more than one slide.
     * @type {Number}
     */
    this.indexOffset = 1;

    /**
     * Flag to detect when an animation is in progress.
     * @type {Boolean}
     */
    this.isAnimated = false;
  }


  /**
   * Initialise PrismSlider.
   */
  PrismSlider.prototype.init = function() {

    this.addCanvas_();

    // Add mask only if there is any.
    if (this.mask) this.addMask_();

    // Timeout to fix first time render bug on firefox.
    setTimeout(this.addSlides_.bind(this), 0);
  };


  /**
   * Create canvas element, get context, set sizes
   * and append to main container.
   */
  PrismSlider.prototype.addCanvas_ = function() {

    this.canvas = document.createElement('canvas');

    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.settings.container.sizes.w;
    this.canvas.height = this.settings.container.sizes.h;

    this.container.appendChild(this.canvas);
  };


  /**
   * Add Mask.
   * Call loadImage method with path and callback,
   * once the loading will be completed we'll replace
   * the string path (this.mask.source) reference with
   * the actual <img> object.
   */
  PrismSlider.prototype.addMask_ = function() {

    var path = this.mask.source;
    var callback = this.renderMask_.bind(this);
    // Replace image path with <img> object.
    this.mask.source = this.loadImage_(path, callback);
  };


  /**
   * Add Slides.
   * Call loadImage method for each image path in the slides array,
   * only when it's the first slide pass render callback,
   * when loading completed replace image path with <img> object.
   */
  PrismSlider.prototype.addSlides_ = function() {

    this.slides.forEach(function(path, i) {
      // Render only first slide.
      var callback = (i === 0) ? this.renderSlide_.bind(this, i) : null;
      // Replace image path with <img> object.
      this.slides[i] = this.loadImage_(path, callback);

    }, this);
  };


  /**
   * Load image source from path and fire given callback,
   * return loaded <img> object.
   * @param  {String}   path     The path of the file.
   * @param  {Function} callback The callback to be executed when
   *                             loading completed.
   * @return {Object}            The JavaScript <img> object.
   */
  PrismSlider.prototype.loadImage_ = function(path, callback) {

    var image = new Image();

    image.onload = callback;

    // Path always after callback.
    image.src = path;

    return image;
  };


  /**
   * Draw mask.
   * Calculate center position and draw mask width and height at 100% of
   * the container sizes.
   */
  PrismSlider.prototype.renderMask_ = function() {
    var centerX = this.canvas.width / 2 - this.settings.container.sizes.w / 2;
    var centerY = this.canvas.height / 2 - this.settings.container.sizes.h / 2;

    var w = this.settings.container.sizes.w;
    var h = this.settings.container.sizes.h;

    this.context.drawImage(this.mask.source, centerX, centerY, w, h);
  };


  /**
   * Draw Slide.
   * Calculate frame position, apply composite operation
   * and effects on the image when there is a mask.
   * @param  {Number} i        The index used to get the img to render.
   * @param  {Number} progress The progress value.
   */
  PrismSlider.prototype.renderSlide_ = function(i, progress) {

    // Set progress to 0 if Not a Number or undefined.
    progress = (isNaN(progress) || progress === undefined) ? 0 : progress;

    // Get img object from array.
    var slide = this.slides[i];

    // Calculate X position.
    var x = this.canvas.width * (i - progress);
    var y = 0;

    var w = this.canvas.width;
    var h = this.canvas.height;

    // Apply composite operation.
    if (this.mask) this.context.globalCompositeOperation = 'source-atop';

    this.context.save();

    if (this.mask) this.applyEffects_();

    // Draw slide.
    this.context.drawImage(slide, x, y, w, h);

    this.context.restore();
  };


  /**
   * Apply effects.
   * Check mask object parameters and select effect.
   */
  PrismSlider.prototype.applyEffects_ = function() {
    if (this.mask.effects.flip) this.flip_();
    if (this.mask.effects.rotate > 0) this.rotate_();
  };


  /**
   * Flip Effect.
   */
  PrismSlider.prototype.flip_ = function() {
    // Get axes.
    var axes = this.mask.effects.flip;

    if (axes === 'X') {
      // Invert x position.
      this.context.translate(this.canvas.width, 0);
      // Flip context horizontally.
      this.context.scale(-1, 1);
    }

    if (axes === 'Y') {
      // Invert y position.
      this.context.translate(0, this.canvas.height);
      // Flip context vertically.
      this.context.scale(1, -1);
    }
  };


  /**
   * Rotate Effect.
   */
  PrismSlider.prototype.rotate_ = function() {
    // Convert degrees to radians.
    var radians = this.mask.effects.rotate * (Math.PI / 180);
    // Move registration point to the center of the canvas.
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    // Apply rotation.
    this.context.rotate(radians);
    // Move registration point back to the top left corner of canvas.
    this.context.translate(-this.canvas.width / 2, -this.canvas.height / 2);
  };


  /**
   * Slide To.
   * @param {Number} index The destination slide index.
   */
  PrismSlider.prototype.slideTo = function(index) {
    // Prevent when animation is in progres or if same bullet is clicked.
    if (this.isAnimated || index === this.slidesIndex) return;

    // Store current (start) index.
    this.prevSlidesIndex = this.slidesIndex;
    // Set destination (end) index.
    this.slidesIndex = index;

    // Calculate how many slides between current (start) and destination (end).
    var indexOffset = (this.prevSlidesIndex - this.slidesIndex) * -1;
    // Store offset always converted to positive number.
    this.indexOffset = (indexOffset > 0) ? indexOffset : indexOffset * -1;

    // Kickstart animation.
    this.animate_();
  };


  /**
   * Animate.
   */
  PrismSlider.prototype.animate_ = function() {

    // Calculate end time.
    var end = Date.now() + this.duration;

    // Mark animation as in progress.
    this.isAnimated = true;
    // Kickstart frames ticker.
    this.ticker_(end);
  };


  /**
   * Ticker called for each frame of the animation.
   * @param {Number} end The end time of the animation.
   */
  PrismSlider.prototype.ticker_ = function(end) {

    // Start time.
    var now = Date.now();
    // Update time left in the animation.
    var remaining = end - now;

    // Retrieve easing and multiply for number of slides between stars
    // and end, in order to jump through N slides in one ease.
    var easing = this.easing(remaining / this.duration) * this.indexOffset;

    var i, progress, slide;

    // Select sliding direction.
    if (this.slidesIndex > this.prevSlidesIndex) {

      // Sliding forward.
      progress = this.slidesIndex - easing;

      // Loop offset and render slides from start to end.
      for (i = 0; i <= this.indexOffset; i++) {
        slide = this.slidesIndex - i;
        this.renderSlide_(slide, progress);
      }

    } else {

      // Sliding backward.
      progress = this.slidesIndex + easing;

      // Loop offset and render slides from start to end.
      for (i = 0; i <= this.indexOffset; i++) {
        slide = this.slidesIndex + i;
        this.renderSlide_(slide, progress);
      }
    }

    // Under 50 milliseconds reset and stop.
    if (remaining < 50) {
      // Set default value.
      this.indexOffset = 1;
      // Make sure slide is perfectly aligned.
      this.renderSlide_(this.slidesIndex);
      // Mark animation as finished.
      this.isAnimated = false;
      // Stop.
      return;
    }

    // Kickstart rAF with updated end.
    window.requestAnimationFrame(this.ticker_.bind(this, end));
  };


  return PrismSlider;

})(window);
