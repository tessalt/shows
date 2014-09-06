var CreateEpisodes = function () {
  this.up = function (next) {
    var def = function (t) {
          t.column('name', 'string');
          t.column('number', 'number');
          t.column('season', 'number');
          t.column('description', 'text');
        }
      , callback = function (err, data) {
          if (err) {
            throw err;
          }
          else {
            next();
          }
        };
    this.createTable('episode', def, callback);
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
    this.dropTable('episode', callback);
  };
};

exports.CreateEpisodes = CreateEpisodes;
