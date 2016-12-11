var expect = require('chai').expect;
var generate = require('./');
var passes = 10000;

describe('Generate password with default options', function() {
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

      expect(password.entropy).to.be.greaterThan(60, 'entropy');
      expect(password.blindEntropy).to.be.greaterThan(96, 'blind entropy');

      var words = password.pass.split('-');
      var padding = words.pop();
      expect(padding.match(/^\d[!@#$%^&*()]$/)).to.exist;

      var capitalWords = 0;
      words.forEach(function (word) {
        if (word == word.toUpperCase()) capitalWords++;
      });
      expect(capitalWords).to.be.greaterThan(0).and.lessThan(4);
    }
    done();
  });
});

describe('Generate password with alternative options', function() {
  var passwords = [];

  before(function () {
    for (var i = 0; i < passes; i++) {
      passwords.push(generate({
        words: {
          exactly: 5,
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
          exactly: 4,
          min: 4,
          max: 8
        }
      }));
      console.log(passwords[i].pass);
    }
  });

  it('should generate password with good entropy', function(done) {
    expect(passwords).to.be.an('array');
    for (var i = 0; i < passwords.length; i++) {
      var password = passwords[i];
      expect(password).to.have.property('pass');

      expect(password.entropy).to.be.greaterThan(60, 'entropy');
      expect(password.blindEntropy).to.be.greaterThan(96, 'blind entropy');
    }
    done();
  });
});
