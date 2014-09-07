var AddDirectionToVote = function () {
  this.up = function (next) {
    this.addColumn('votes', 'direction', 'number', function(err, data){
      if (err) {
        throw err;
      } else {
        next();
      }
    });
  };

  this.down = function (next) {
    next();
  };
};

exports.AddDirectionToVote = AddDirectionToVote;
