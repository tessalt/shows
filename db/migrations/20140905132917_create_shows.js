var CreateShows = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('title', 'string');
          t.column('tvdbId', 'number');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('shows', def, callback);
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
    this.dropTable('shows', callback);
  };
};

exports.CreateShows = CreateShows;
