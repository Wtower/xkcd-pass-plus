var expect = require('chai').expect;
var generate = require('./');
var passes = 10000;

describe('Generate password with xkcd options', function() {
  var passwords = [];
  var minEntropy = 1024;

  before(function () {
    for (var i = 0; i < passes; i++) {
      passwords.push(generate({
        words: {
          dictionary: 'xkcd',
          num: 4,
          min: 4,
          max: 8
        }
      }));
      minEntropy = Math.min(minEntropy, passwords[i].entropy);
    }
    console.log('Generated ' + passes + ' passwords with minimum entropy of ' + minEntropy);
  });

  it('should generate password with good entropy', function(done) {
    expect(passwords).to.be.an('array');
    for (var i = 0; i < passwords.length; i++) {
      var password = passwords[i];
      expect(password).to.have.property('pass');

      expect(password.entropy).to.be.least(60, 'entropy: ' + password.pass);
      expect(password.blindEntropy).to.be.least(96, 'blind entropy');

      var words = password.pass.split('-');
      var padding = words.pop();
      expect(padding.match(/^\d[!@#$%^&*()]$/)).to.exist;

      var capitalWords = 0;
      words.forEach(function (word) {
        if (word == word.toUpperCase()) capitalWords++;
        expect(word.length).to.be.least(4).and.most(8);
      });
      expect(capitalWords).to.be.greaterThan(0).and.lessThan(4);
    }
    done();
  });
});

describe('Generate password with alternative xkcd options', function() {
  var passwords = [];

  before(function () {
    for (var i = 0; i < passes; i++) {
      passwords.push(generate({
        words: {
          dictionary: 'xkcd',
          num: 5,
          min: 4,
          max: 8
        },
        separator: '=',
        paddingDigits: {
          before: 2,
          after: 0
        },
        paddingSymbols: {
          symbols: '!@#$%^&*()',
          before: 2,
          after: 0
        }
      }));
    }
  });

  it('should generate password with appropriate form', function(done) {
    expect(passwords).to.be.an('array');
    for (var i = 0; i < passwords.length; i++) {
      var password = passwords[i];
      expect(password).to.have.property('pass');

      var words = password.pass.split('=');
      var padding = words.shift();
      expect(padding.match(/^[!@#$%^&*()].\d.$/)).to.exist;

      var capitalWords = 0;
      words.forEach(function (word) {
        if (word == word.toUpperCase()) capitalWords++;
        expect(word.length).to.be.least(4).and.most(8);
      });
      expect(capitalWords).to.be.greaterThan(0).and.lessThan(5);
    }
    done();
  });
});

describe('Generate password with letterpress dictionary', function() {
  var passwords = [];

  before(function () {
    for (var i = 0; i < passes; i++) {
      passwords.push(generate({
        words: {
          dictionary: 'letterpress',
          num: 4,
          min: 4,
          max: 8
        }
      }));
    }
  });

  it('should generate password with good entropy', function(done) {
    expect(passwords).to.be.an('array');
    for (var i = 0; i < passwords.length; i++) {
      var password = passwords[i];
      expect(password).to.have.property('pass');

      expect(password.entropy).to.be.least(60, 'entropy');
      expect(password.blindEntropy).to.be.least(96, 'blind entropy');

      var words = password.pass.split('-');
      var padding = words.pop();
      expect(padding.match(/^\d[!@#$%^&*()]$/)).to.exist;

      var capitalWords = 0;
      words.forEach(function (word) {
        if (word == word.toUpperCase()) capitalWords++;
        expect(word.length).to.be.least(4).and.most(8);
      });
      expect(capitalWords).to.be.greaterThan(0).and.lessThan(4);
    }
    done();
  });
});

describe('Generate password with default mixed dictionary', function() {
  var passwords = [];

  before(function () {
    for (var i = 0; i < passes; i++) {
      passwords.push(generate());
    }
  });

  it('should generate password with good entropy', function(done) {
    expect(passwords).to.be.an('array');
    for (var i = 0; i < passwords.length; i++) {
      var password = passwords[i];
      expect(password).to.have.property('pass');

      expect(password.entropy).to.be.least(60, 'entropy');
      expect(password.blindEntropy).to.be.least(96, 'blind entropy');

      var words = password.pass.split('-');
      var padding = words.pop();
      expect(padding.match(/^\d[!@#$%^&*()]$/)).to.exist;

      var capitalWords = 0;
      words.forEach(function (word) {
        if (word == word.toUpperCase()) capitalWords++;
        expect(word.length).to.be.least(4).and.most(8);
      });
      expect(capitalWords).to.be.greaterThan(0).and.lessThan(4);
    }
    done();
  });
});
