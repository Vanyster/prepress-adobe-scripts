/*
<javascriptresource>
<menu>hide</menu>
</javascriptresource>
*/

// Do not confuse `Bounds` with `Rectangle`.
// Bounds is a SUI class for SUI controls, it has a property `left`, `top`, etc.
// Rectangle is just an array with 4 values for Illustrator's PageItem, it has no custom property.

/**
 * Check if two `Rectangle` are equal.
 * @param {Array} other array of 4 values.
 */
Array.prototype.equalTo = function(other) {
  return isEqualRounded(this.getLeft(), other.getLeft()) &&
    isEqualRounded(this.getTop(), other.getTop()) &&
    isEqualRounded(this.getRight(), other.getRight()) &&
    isEqualRounded(this.getBottom(), other.getBottom())
}

/**
 * Returns true if the first `Rectangle` are inside the second.
 * @param {Array} other array of 4 values.
 * @see https://gist.github.com/Daniel-Hug/d7984d82b58d6d2679a087d896ca3d2b
 */
Array.prototype.isWithin = function(other) {
  return !(
    this.getLeft() < other.getLeft() ||
    this.getBottom() < other.getBottom() ||
    this.getRight() > other.getRight() ||
    this.getTop() > other.getTop()
  )
}

/**
 * Returns x1 value of this `Rectangle` or `Point`.
 * @return {Number}
 */
Array.prototype.getLeft = function() { return this[0] }

/**
 * Returns y1 value of this `Rectangle` or `Point`.
 * @return {Number}
 */
Array.prototype.getTop = function() { return this[1] }

/**
 * Returns x2 value of this `Rectangle`.
 * @return {Number}
 */
Array.prototype.getRight = function() { return this[2] }

/**
 * Returns y2 value of this `Rectangle`.
 * @return {Number}
 */
Array.prototype.getBottom = function() { return this[3] }

/**
 * Returns width value of this `Rectangle`.
 * @return {Number}
 */
Array.prototype.getWidth = function() { return this.getRight() - this.getLeft() }

/**
 * Returns height value of this `Rectangle`.
 * @return {Number}
 */
Array.prototype.getHeight = function() { return this.getTop() - this.getBottom() }
