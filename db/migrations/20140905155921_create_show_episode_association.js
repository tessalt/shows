var CreateShowEpisodeAssociation = function () {
  this.up = function (next) {
    this.addColumn('episodes', 'showId', 'string', function(err, data){
      if (err) {
        throw err;
      }
      next();
    });
  };

  this.down = function (next) {
    this.removeColumn('episodes', 'showId', function(err, data){
      if (err) {
        throw err;
      }
      next();
    });
  };
};

exports.CreateShowEpisodeAssociation = CreateShowEpisodeAssociation;
