var assert = require('assert')
  , tests
  , Show = geddy.model.Show;

tests = {

  'after': function (next) {
    // cleanup DB
    Show.remove({}, function (err, data) {
      if (err) { throw err; }
      next();
    });
  }

, 'simple test if the model saves without a error': function (next) {
    var show = Show.create({});
    show.save(function (err, data) {
      assert.equal(err, null);
      next();
    });
  }

, 'test stub, replace with your own passing test': function () {
    assert.equal(true, false);
  }

};

module.exports = tests;
