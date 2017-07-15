xkcd-pass-plus
==============

[![NPM version][npm-image]][npm-url] 
[![Build Status][travis-image]][travis-url] 
[![Coverage Status](https://coveralls.io/repos/github/Wtower/xkcd-pass-plus/badge.svg?branch=master)](https://coveralls.io/github/Wtower/xkcd-pass-plus?branch=master) 
[![npm](https://img.shields.io/npm/dt/xkcd-pass-plus.svg?maxAge=2592000)](https://www.npmjs.com/package/xkcd-pass-plus)

[npm-image]: https://badge.fury.io/js/xkcd-pass-plus.svg
[npm-url]: https://npmjs.org/package/xkcd-pass-plus
[travis-image]: https://travis-ci.org/Wtower/xkcd-pass-plus.svg?branch=master
[travis-url]: https://travis-ci.org/Wtower/xkcd-pass-plus

Password generator based on XKCD.

This module is inspired by a [XKCD comic](http://xkcd.com/936/). 
It generates a safe and memorable password based on a combinations of english words.

Usage as a module
-----------------

### Installation

    $ npm install -S xkcd-pass-plus

### Usage

    var generate = require('xkcd-pass-plus');
    var pass = generate(options).pass;

### Options

```
var defaultOptions = {
  words: {
    dictionary: 'mixed', // xkcd (2k, most memorable) or letterpress (270k) or mixed
    num: 4, // number of words to generate
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
```

### Output

Retuns an object as follows:

```
{ 
  pass: 'beginning-straight-LAST-BROKEN-1!',
  entropy: 149,
  blindEntropy: 202,
  rating: { 
    min: 128,
    max: 1024,
    rate: 'very strong',
    comment: 'often overkill' 
  } 
}
```

The return object contains the generated password with additional information on the password's 
entropy and strength rating.

Usage with CLI
--------------

### Installation

    $ npm install -g xkcd-pass-plus

### Usage and options

```
$ xkcd-pass-plus -h
usage: xkcd-pass-plus [-h] [-v] [-d DICTIONARY] [-w WORD_NUM] 
                      [--word-min WORD_MIN] [--word-max WORD_MAX]
                      [-s SEPARATOR] [--pad-digit-before PAD_DIGIT_BEFORE]
                      [--pad-digit-after PAD_DIGIT_AFTER]
                      [--pad-symbols PAD_SYMBOLS]
                      [--pad-symbol-before PAD_SYMBOL_BEFORE]
                      [--pad-symbol-after PAD_SYMBOL_AFTER]
                      

Password generator based on XKCD.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -d DICTIONARY, --dictionary DICTIONARY
                        `xkcd` (2k, most memorable), `letterpress` (270k) or 
                        `mixed`.
  -w WORDS, --word-num WORD_NUM
                        Number of words to generate.
  --word-min WORD_MIN   Minimum length of each word.
  --word-max WORD_MAX   Maximum length of each word.
  -s SEPARATOR, --separator SEPARATOR
                        How to join words.
  --pad-digit-before PAD_DIGIT_BEFORE
                        How many digits to add before the pass.
  --pad-digit-after PAD_DIGIT_AFTER
                        How many digits to add after the pass.
  --pad-symbols PAD_SYMBOLS
                        Which symbols to use in padding.
  --pad-symbol-before PAD_SYMBOL_BEFORE
                        How many symbols to add before the pass.
  --pad-symbol-after PAD_SYMBOL_AFTER
                        How many symbols to add after the pass.
```

### Output

```
$ xkcd-pass-plus
Password generator based on XKCD.
Generated password: [ smaller-NEVER-ORDINARY-FINGER-4^ ] 
Entropy: 138
Blind entropy: 196
Rating: very strong: often overkill
```

Security
--------

A word on the password strength. Obviously this is a huge area to cover properly.
It is arguable how much more memorable is such a password, and if it is equally strong 
with a long random character pass. The former is quite subjective, but obviously it is
in the author's range of fanciness. And also to mention that is easier to type.
The latter requires some explanation.

The password strength can be expressed with its entropy number, which is nothing more than
a number that is based on the range of characters used and the length of the password.
As computers grow stronger, it is increasingly easier to brute-force passwords with
smaller entropy numbers. Therefore, the strength rating based on the entropy is relevant,
but an entropy of 64+ is quite good currently.
 
The blind entropy refers to the possibility that the attacker has absolutely no idea about
the form of our password. The (not blind) entropy refers to a more distant but sage assumption that the
attacker knows the exact range of characters used. The algorithm's rating is based on the latter.

Here we need to make the argument about what happens when the attacker brute-forces using a
dictionary. Then the entropy calculation based on the range of characters no longer applies.
Obviously the entropy relates to the range of dictionary words and the number of words used.

The XKCD dictionary is approximately a bit more than 2000 words. 2000^4 combinations would 
result to a small entropy. If only the attacker knew that this is the dictionary on which 
a user based his or her password.

For this reason, an additional dictionary based on Letterpress is offered, which contains
270k words. This reduces the possibility of a brute-force greatly, but also the memorability.
Thus the default method is a combination of the two dictionaries.

Tests
-----

How can we be sure that the password produced is safe. Well, we cannot be 100% sure.
The module includes some automated tests that produce 10000 passwords and it requires that
all of them have at least 60 bits of entropy. Very rarely the entropy dropped below 80.
You are free to conduct your own CPU-intensive tests.

Alternatives
------------

This module used in memory (array) dictionary, and in future an additional dictionary module that
is based on sync file read.

The [node-xkcd-password](https://github.com/fardog/node-xkcd-password) package with async methods
but fewer tests.

Disclaimer
----------

The author is not at all responsible for any loss of any kind that may result from the
use of this module whatsoever.

License
-------

MIT © [Wtower](https://github.com/Wtower)
