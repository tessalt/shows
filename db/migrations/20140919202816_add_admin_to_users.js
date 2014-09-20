var AddAdminToUsers = function () {
  this.up = function (next) {
    this.addColumn('users', 'admin', 'boolean', function(err, data){
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

exports.AddAdminToUsers = AddAdminToUsers;
