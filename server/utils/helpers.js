// server/utils/helpers.js
// This file contains helper functions that can be shared across different controllers.

/**
 * Recursively converts BigInt values to strings within an object or array.
 * This is a crucial utility because JSON.stringify() throws an error if it
 * encounters a BigInt, which the MariaDB driver can return for certain integer types.
 * @param {any} value The value to process (can be an object, array, or primitive).
 * @returns {any} The processed value with all BigInts converted to strings.
 */
exports.toJSONSafe = function toJSONSafe(value) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(toJSONSafe);
  }
  // It's an object, so we process each key.
  const newObj = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      newObj[key] = toJSONSafe(value[key]);
    }
  }
  return newObj;
};
