var expect = require('chai').expect;
var generate = require('./index');

describe('Generate password', function() {
  it('should generate a password', function(done) {
    expect(generate()).to.equal('ok');
    done();
  });
});
