var CreateVotes = function () {
  this.up = function (next) {
    var def = function (t) {
      t.column('userId', 'string');
      t.column('episodeId', 'string');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('vote', def, callback);
  };

  this.down = function (next) {
    var callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.dropTable('vote', callback);
  };
};

exports.CreateVotes = CreateVotes;
