/**
 * Utility functions for parsing quiz options from various formats
 * Handles string JSON, arrays, objects, and legacy formats
 */

/**
 * Parse options data from various formats into a consistent array
 * @param {*} optionsData - The options data to parse (string, array, object)
 * @returns {Array} - Array of option strings
 */
export const parseOptions = (optionsData) => {
  try {
    // Handle null/undefined
    if (!optionsData) {
      return [];
    }

    // Handle string JSON format
    if (typeof optionsData === 'string') {
      const parsed = JSON.parse(optionsData);
      return Array.isArray(parsed) ? parsed : [];
    }

    // Handle array format (already correct)
    if (Array.isArray(optionsData)) {
      return optionsData;
    }

    // Handle object format like {A: "option1", B: "option2", ...}
    if (optionsData && typeof optionsData === 'object') {
      return Object.values(optionsData);
    }

    // Fallback for unknown formats
    return [];
  } catch (error) {
    console.error('Error parsing options:', error, optionsData);
    return [];
  }
};

/**
 * Parse options and format them with keys (A, B, C, D)
 * @param {*} optionsData - The options data to parse
 * @returns {Array} - Array of objects with {key, value} format
 */
export const parseOptionsWithKeys = (optionsData) => {
  const optionsArray = parseOptions(optionsData);
  return optionsArray.map((value, index) => ({
    key: String.fromCharCode(65 + index), // A, B, C, D
    value: value || ''
  }));
};

/**
 * Normalize options to exactly 4 items for forms
 * @param {*} optionsData - The options data to parse
 * @returns {Array} - Array of exactly 4 option strings
 */
export const normalizeOptionsForForm = (optionsData) => {
  const options = parseOptions(optionsData);
  const normalized = ['', '', '', ''];
  
  for (let i = 0; i < Math.min(options.length, 4); i++) {
    normalized[i] = options[i] || '';
  }
  
  return normalized;
};

/**
 * Validate that options data is in correct format
 * @param {*} optionsData - The options data to validate
 * @returns {Object} - {isValid: boolean, error: string}
 */
export const validateOptions = (optionsData) => {
  try {
    const options = parseOptions(optionsData);
    
    if (!Array.isArray(options)) {
      return {
        isValid: false,
        error: 'Options must be an array'
      };
    }
    
    if (options.length === 0) {
      return {
        isValid: false,
        error: 'At least one option is required'
      };
    }
    
    if (options.some(option => !option || typeof option !== 'string' || !option.trim())) {
      return {
        isValid: false,
        error: 'All options must be non-empty strings'
      };
    }
    
    return {
      isValid: true,
      error: null
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Validation error: ${error.message}`
    };
  }
};

/**
 * Convert options array to JSON string for storage
 * @param {Array} optionsArray - Array of option strings
 * @returns {string} - JSON string representation
 */
export const optionsToJSON = (optionsArray) => {
  try {
    if (!Array.isArray(optionsArray)) {
      throw new Error('Options must be an array');
    }
    return JSON.stringify(optionsArray);
  } catch (error) {
    console.error('Error converting options to JSON:', error);
    return JSON.stringify([]);
  }
};

/**
 * Get option letter by index (0 -> A, 1 -> B, etc.)
 * @param {number} index - The index (0-based)
 * @returns {string} - The letter (A, B, C, D, etc.)
 */
export const getOptionLetter = (index) => {
  return String.fromCharCode(65 + index);
};

/**
 * Get option index by letter (A -> 0, B -> 1, etc.)
 * @param {string} letter - The letter (A, B, C, D, etc.)
 * @returns {number} - The index (0-based)
 */
export const getOptionIndex = (letter) => {
  return letter.toUpperCase().charCodeAt(0) - 65;
};

/**
 * Format options for display in UI components
 * @param {*} optionsData - The options data to format
 * @param {Object} config - Configuration options
 * @returns {Array} - Formatted options array
 */
export const formatOptionsForDisplay = (optionsData, config = {}) => {
  const {
    withKeys = true,
    maxLength = null,
    showEmpty = false
  } = config;
  
  const options = parseOptions(optionsData);
  
  if (!showEmpty && options.length === 0) {
    return [];
  }
  
  return options.map((value, index) => {
    let formattedValue = value || '';
    
    // Truncate if maxLength specified
    if (maxLength && formattedValue.length > maxLength) {
      formattedValue = formattedValue.substring(0, maxLength) + '...';
    }
    
    const result = {
      index,
      value: formattedValue,
      originalValue: value
    };
    
    if (withKeys) {
      result.key = getOptionLetter(index);
      result.label = `${result.key}. ${formattedValue}`;
    }
    
    return result;
  });
};

// Export all functions as default object for convenience
export default {
  parseOptions,
  parseOptionsWithKeys,
  normalizeOptionsForForm,
  validateOptions,
  optionsToJSON,
  getOptionLetter,
  getOptionIndex,
  formatOptionsForDisplay
};
