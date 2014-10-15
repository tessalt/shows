var Votes = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;
    geddy.model.Vote.all({episodeId: params.episodeId}, {},function(err, votes){
      if (err) {
        throw err;
      }
      var response = {
        votes: votes
      }
      self.respond(response);
    });
  };

  this.create = function (req, resp, params) {
    var self = this;
    var userId = this.session.get('userId');
    geddy.model.Vote.first({userId: userId, episodeId: params.vote.episodeId}, function(err, vote){
      console.log(vote);
      if (vote) {
        throw new geddy.errors.BadRequestError();
      } else {
        params.vote.userId = userId;
        var vote = geddy.model.Vote.create(params.vote);
        if (!vote.isValid()) {
          self.respondWith(vote);
        } else {
          vote.save(function(err, data) {
            if (err) {
              throw err;
            }
            var response = {
              vote: vote
            }
            self.respond(response);
          });
        }
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Vote.first(params.id, function(err, vote){
      if (err) {
        throw err;
      }
      if (!vote) {
        throw new geddy.errors.NotFoundError();
      } else {
        var response = {
          vote: vote
        }
        self.respond(response);
      }
    });
  };

  this.edit = function (req, resp, params) {
    this.respond({params: params});
  };

  this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
  };

  this.remove = function (req, resp, params) {
    var self = this;
    geddy.model.Vote.first(params.id, function(err, vote){
      if (err) {
        throw err;
      }
      if (!vote) {
        throw new geddy.errors.BadRequestError();
      } else {
        geddy.model.Vote.remove(params.id, function(err){
          if (err) {
            throw err;
          }
          var response = {vote: vote};
          self.respond(response);
        });
      }
    });
  };

};

exports.Votes = Votes;

