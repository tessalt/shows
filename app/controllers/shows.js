var passport = require('../helpers/passport')
  , cryptPass = passport.cryptPass
  , requireAuth = passport.requireAuth;

var Shows = function () {
  this.canRespondTo(['json']);
  this.respondsWith = ['json'];

  this.before(function(){
    if (!(this.session.get('userId'))) {
      self.respond('You must be logged in', {
        statusCode: 403,
        format: 'txt'
      });
    }
  }, {except: ['index', 'show']});


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
    geddy.model.Show.first(params.show.id, function(err, show) {
      if (!show) {
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
        self.respond('show already added', {
          statusCode: 403,
          format: 'txt'
        })
      }
    });
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
    var user = geddy.model.User.first(this.session.get('userId'), function(err, user){
      if (err) {
        throw err;
      }
      if (user.admin) {
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
      } else {
        throw new geddy.errors.BadRequestError();
      }
    });
  };

};

exports.Shows = Shows;

