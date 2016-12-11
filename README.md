xkcd-pass-plus
==============

[![NPM version][npm-image]][npm-url] 
[![Build Status][travis-image]][travis-url] 
[![Coverage Status](https://coveralls.io/repos/github/Wtower/generator-makrina/badge.svg?branch=master)](https://coveralls.io/github/Wtower/generator-makrina?branch=master) 
[![Dependency Status][daviddm-image]][daviddm-url] 
[![npm](https://img.shields.io/npm/dt/generator-makrina.svg?maxAge=2592000)](https://www.npmjs.com/package/generator-makrina)

[npm-image]: https://badge.fury.io/js/xkcd-pass-plus.svg
[npm-url]: https://npmjs.org/package/xkcd-pass-plus
[travis-image]: https://travis-ci.org/Wtower/xkcd-pass-plus.svg?branch=master
[travis-url]: https://travis-ci.org/Wtower/xkcd-pass-plus
[daviddm-image]: https://david-dm.org/Wtower/xkcd-pass-plus.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Wtower/xkcd-pass-plus

Password generator based on XKCD.

This module is inspired by a [XKCD comic](http://xkcd.com/936/). 
It generates a safe and memorable password based on a combinations of english words.

Usage
-----

### Installation

    $ npm install -S xkcd-pass-plus

### Usage

    var generate = require('xkcd-pass-plus');
    var pass = generate(options).pass;

### Options

The [default options](https://github.com/Wtower/xkcd-pass-plus/blob/master/index.js#L8) are:

```
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
```

### Returns

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

Security
--------

A word on the password strength. Obviously this is a huge area to cover properly.
It is arguable how much more memorable is such a password, and if it is equally strong 
with a long random character pass. The former is quite subjective, but obviously it is
in the author's range of fanciness. The latter requires some explanation.

The password strength can be expressed with its entropy number, which is nothing more than
a number that is based on the range of characters used and the length of the password.
As computers grow stronger, it is increasingly easier to brute-force passwords with
smaller entropy numbers. Therefore, the strength rating based on the entropy is relevant,
but an entropy of 64+ is quite good currently.
 
The blind entropy refers to the possibility that the attacker has absolutely no idea about
the form of our password. The entropy refers to a more distant but sage assumption that the
attacker knows the exact range of characters used. The algorithm's rating is based on the latter.

Here we need to make the argument about what happens when the attacker brute-forces using a
dictionary. Then the entropy calculation based on the range of characters no longer applies.
Obviously the entropy relates to the range of dictionary words and the number of words used.

Currently this specific algorithm uses the XKCD dictionary which is approximately a bit more than
2000 words. 2000^4 combinations results to a small entropy. If only the attacker knew that this is the
dictionary on which a user based his or her password. Soon we will introduce a larger range in
the algorithm.

Tests
-----

How can we be sure that the password produced is safe. Well, we cannot be 100% sure.
The module includes some automated tests that produce 10000 passwords and it requires that
all of them have at least 60 bits of entropy. You are free to conduct your own CPU-intensive tests.

Disclaimer
----------

The author is not at all responsible for any loss of any kind that may result from the
use of this module whatsoever.

License
-------

MIT © [Wtower](https://github.com/Wtower)
