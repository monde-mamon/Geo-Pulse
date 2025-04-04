// utils.js

/**
 * Checks if a value is null
 * @param {*} value
 * @returns {boolean}
 */
export function isNull(value) {
  return value === null;
}

/**
 * Checks if a value is undefined
 * @param {*} value
 * @returns {boolean}
 */
export function isUndefined(value) {
  return typeof value === "undefined";
}

/**
 * Checks if a value is empty:
 * - null
 * - undefined
 * - empty string
 * - empty array
 * - empty object
 * @param {*} value
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (isNull(value) || isUndefined(value)) return true;

  if (typeof value === "string" && value.trim().length === 0) return true;

  if (Array.isArray(value) && value.length === 0) return true;

  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}
