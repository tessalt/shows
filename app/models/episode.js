var Episode = function () {

  this.defineProperties({
    name: {type: 'string', required: true},
    number: {type: 'number'},
    season: {type: 'number'},
    description: {type: 'text'},
    writer: {type: 'string'},
    director: {type: 'string'},
    airdate: {type: 'string'},
    stars: {type: 'string'}
  });

  this.belongsTo('Show');
  this.hasMany('Vote');
  this.validatesPresent('name');

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Episode.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Episode.someStaticMethod = function () {
  // Do some other stuff
};
Episode.someStaticProperty = 'YYZ';
*/

Episode = geddy.model.register('Episode', Episode);

