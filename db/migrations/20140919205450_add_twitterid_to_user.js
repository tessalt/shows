var AddTwitteridToUser = function () {
  this.up = function (next) {
    this.addColumn('users', 'twitterId', 'string', function(err, data){
      if (err) {
        throw err;
      } else {
        next();
      }
    })
  };

  this.down = function (next) {
    next();
  };
};

exports.AddTwitteridToUser = AddTwitteridToUser;
