#!/usr/bin/env node
var argparse = require('argparse');
var pack = require('./package.json');
var generate = require('./');
var chalk = require('chalk');

var parser = new argparse.ArgumentParser({
  description: pack.description,
  version: pack.version
});
parser.addArgument(['-w', '--words', '--words-exactly'], {
  help: 'Number of words to generate',
  type: 'int',
  defaultValue: 4
});
parser.addArgument(['--word-min'], {
  help: 'Minimum length of each word',
  type: 'int',
  defaultValue: 4
});
parser.addArgument(['--word-max'], {
  help: 'Maximum length of each word',
  type: 'int',
  defaultValue: 8
});
parser.addArgument(['-s', '--separator'], {
  help: 'How to join words',
  type: 'string',
  defaultValue: '-'
});
parser.addArgument(['--pad-digit-before'], {
  help: 'How many digits to add before the pass',
  type: 'int',
  defaultValue: 0
});
parser.addArgument(['--pad-digit-after'], {
  help: 'How many digits to add after the pass',
  type: 'int',
  defaultValue: 1
});
parser.addArgument(['--pad-symbols'], {
  help: 'Which symbols to use in padding',
  type: 'string',
  defaultValue: '!@#$%^&*()'
});
parser.addArgument(['--pad-symbol-before'], {
  help: 'How many symbols to add before the pass',
  type: 'int',
  defaultValue: 0
});
parser.addArgument(['--pad-symbol-after'], {
  help: 'How many symbols to add after the pass',
  type: 'int',
  defaultValue: 1
});
var args = parser.parseArgs();

var pass = generate({
  words: {
    exactly: args.words,
    min: args.words_min,
    max: args.words_max
  },
  separator: args.separator,
  paddingDigits: {
    before: args.pad_digit_before,
    after: args.pad_digit_after
  },
  paddingSymbols: {
    symbols: args.pad_symbols,
    before: args.pad_symbol_before,
    after: args.pad_symbol_after
  }
});

var ratingColour = '';
switch (pass.rating.rate) {
  case 'very weak': ratingColour = 'red'; break;
  case 'weak': ratingColour = 'magenta'; break;
  case 'reasonable': ratingColour = 'yellow'; break;
  case 'strong': ratingColour = 'blue'; break;
  case 'very strong': ratingColour = 'green'; break;
  default: ratingColour = 'gray'; break;
}

console.log(pack.description);
console.log('Generated password: [ ' + chalk.gray(pass.pass) + ' ] ');
console.log('Entropy: ' + chalk.bold(pass.entropy));
console.log('Blind entropy: ' + chalk.bold(pass.blindEntropy));
console.log('Rating: ' +
  chalk[ratingColour].bold(pass.rating.rate) + ': ' +
  chalk[ratingColour](pass.rating.comment));
