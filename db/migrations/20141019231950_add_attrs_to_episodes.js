var AddAttrsToEpisodes = function () {
  this.up = function (next) {
    this.addColumn('episodes', 'writer', 'string', function(err, data){
      if (err) {
        throw err;
      } else {
        next();
      }
    });
    this.addColumn('episodes', 'director', 'string', function(err, data) {
      if (err) {
        throw err;
      } else {
        next();
      }
    });
    this.addColumn('episodes', 'airdate', 'string', function(err, data) {
      if (err) {
        throw err;
      } else {
        next();
      }
    });
    this.addColumn('episodes', 'stars', 'string', function(err, data) {
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

exports.AddAttrsToEpisodes = AddAttrsToEpisodes;
