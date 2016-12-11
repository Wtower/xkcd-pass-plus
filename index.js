var randomWords = require('random-words');
var lodash = require('lodash');

/**
 * Default password generation options
 * @type {{words: {exactly: number, min: number, max: number}, separator: string, paddingDigits: {before: number, after: number}, paddingSymbols: {symbols: string, before: number, after: number}}}
 */
var defaultOptions = {
  words: {
    exactly: 4, // number of words to generate
    min: 4, // minimum length of each word
    max: 8 // maximum length of each word
  },
  separator: '-', // how to join words
  paddingDigits: { // how many digits to add before and after the pass 
    before: 0,
    after: 1 
  },
  paddingSymbols: { // how many symbols to add before and after the pass
    symbols: '!@#$%^&*()', // which symbols
    before: 0,
    after: 1
  }
};

/**
 * Return at least 1 uppercase or maximum N-1 uppercase array of N words for an array of N words
 * @param words
 * @returns {*}
 */
var capitalizeWords = function (words) {
  var capitalWords = 0;
  for (var i = 0; i < words.length; i++) {
    if ((lodash.random() && capitalWords < words.length - 1) || (i == words.length - 1 && !capitalWords)) {
      words[i] = lodash.upperCase(words[i]);
      capitalWords++;
    }
  }
  return words;
};

/**
 * Get a random number from 1 to MAX where n is the number of digits
 * @param n
 * @returns {number}
 */
var getDigits = function (n) {
  return Math.floor(lodash.random(Math.pow(10, n - 1), Math.pow(10, n) - 1));
};

/**
 * Get a random sequence of n symbols
 * @param n
 * @param symbols
 * @returns {*}
 */
var getSymbols = function (n, symbols) {
  for (var i = 0, padding = ''; i < n; i++) {
    padding += symbols.charAt(lodash.random(0, symbols.length - 1));
  }
  // return null if empty to avoid later js transform of 0 + '' to '0'.
  return padding ? padding : null;
};

/**
 * Calculate entropy of password
 * http://search.cpan.org/~bartb/Crypt-HSXKPasswd-v3.6/lib/Crypt/HSXKPasswd.pm
 * @param pass
 * @param blind
 * @returns {number}
 */
var calcEntropy = function (pass, blind) {
  var range = blind ? new Array(72).join() : lodash.uniq(pass);
  return Math.floor(Math.log2(range.length) * pass.length);
};

/**
 * Rate an entropy
 * http://rumkin.com/tools/password/passchk.php
 * @param entropy
 * @returns {{min, max, rate, comment}|*}
 */
var rateEntropy = function (entropy) {
  var ratings = [
    {min:   0, max:   27, rate: 'very weak',   comment: 'might keep out family members'},
    {min:  28, max:   35, rate: 'weak',        comment: 'should keep out most people, often good for desktop login'},
    {min:  36, max:   59, rate: 'reasonable',  comment: 'fairly secure passwords for network and company passwords'},
    {min:  60, max:  127, rate: 'strong',      comment: 'can be good for guarding financial information'},
    {min: 128, max: 1024, rate: 'very strong', comment: 'often overkill'}
  ];
  for (var i = 0; i < ratings.length; i++) {
    var rating = ratings[i];
    if (rating.min <= entropy && entropy <= rating.max) return rating;
  }
};

/**
 * MAIN: password generate
 * @param options
 * @returns {{pass, entropy: number, blindEntropy: number, rating: ({min, max, rate, comment}|*)}}
 */
var generate = function (options) {
  options = lodash.extend(defaultOptions, options);
  var words = randomWords(options.words);
  words = capitalizeWords(words);

  var padding =
    getSymbols(options.paddingSymbols.before, options.paddingSymbols.symbols) +
    getDigits(options.paddingDigits.before);
  if (padding) words.unshift(padding);

  padding =
    getDigits(options.paddingDigits.after) +
    getSymbols(options.paddingSymbols.after, options.paddingSymbols.symbols);
  if (padding) words.push(padding);

  var pass = words.join(options.separator);
  var entropy = calcEntropy(pass);
  var blindEntropy = calcEntropy(pass, true);

  return {
    pass: pass,
    entropy: entropy,
    blindEntropy: blindEntropy,
    rating: rateEntropy(entropy)
  };
};

module.exports = generate;
