var Shows = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;
    geddy.model.Show.all(function(err, shows){
      if (err) {
        throw err;
      }
      var response = {
        shows: shows
      }
      self.respond(response);
    });
  };

  this.create = function (req, resp, params) {
    var self = this;
    var user = this.session.get('userId');
    if (user) {
      var existingShow = geddy.model.Show.first(params.show.id);
      if (!existingShow) {
        var show = geddy.model.Show.create(params.show);
        if (!show.isValid()) {
          this.respondWith(show);
        } else {
          show.save(function(err, data) {
            if (err) {
              throw err;
            }
            var response = {
              show: show
            }
            self.respond(response);
          });
        }
      } else {
       this.output(403, {'Content-Type': 'application/json'}, 'This show has already been added');
     }
    } else {
      this.output(403, {'Content-Type': 'application/json'}, 'You must be authorized to add a new show');
    }
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Show.first(params.id, function(err, show){
      if (err) {
        throw err;
      }
      if (!show) {
        throw new geddy.errors.NotFoundError();
      } else {
        var response = {
          show: show
        }
        self.respond(response);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;
    geddy.model.Show.first(params.id, function(err, show){
      if (err) {
        throw err;
      }
      if (!show) {
        throw new geddy.errors.BadRequestError();
      } else {
        self.respondWith(show);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;
    geddy.model.Show.first(params.id, function(err, show){
      if (err) {
        throw err;
      }
      show.updateProperties(params);
      if (!show.isValid()) {
        self.respondWith(show);
      } else {
        show.save(function(err, data){
          if (err) {
            throw err;
          }
          self.respondWith(show, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;
    geddy.model.Show.first(params.id, function(err, show){
      if (err) {
        throw err;
      }
      if (!show) {
        throw new geddy.errors.BadRequestError();
      } else {
        // also will have to remove all related episodes and votes
        geddy.model.Show.remove(params.id, function(err){
          if (err) {
            throw err;
          }
          var response = {show: show};
          geddy.model.Episode.remove({showId: params.id}, function(err) {
            self.respond(response);
          })
        });
      }
    });
  };

};

exports.Shows = Shows;

