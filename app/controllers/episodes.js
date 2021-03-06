var Episodes = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;
    geddy.model.Episode.all({showId: params.showId}, {includes: 'votes'},function(err, episodes){
      var eps = [];
      var votes = [];
      episodes.forEach(function(episode) {
        var epvotes = [];
        if (episode.votes) {
          votes = votes.concat(episode.votes);
          epvotes = episode.votes.map(function(vote){
            return vote.id;
          });
        }
        episode.votes = epvotes;
        eps.push(episode);
      });

      if (err) {
        throw err;
      }
      var response = {
        episodes: eps,
        votes: votes
      }
      self.respond(response);
    });
  };

  this.create = function (req, resp, params) {
    var self = this;
    var episode = geddy.model.Episode.create(params.episode);
    if (!episode.isValid()) {
      this.respondWith(episode);
    } else {
      episode.save(function(err, data) {
        if (err) {
          throw err;
        }
        var response = {
          episode: episode
        }
        self.respond(response);
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Episode.first(params.id, function(err, episode){
      if (err) {
        throw err;
      }
      if (!episode) {
        throw new geddy.errors.NotFoundError();
      } else {
        var response = {
          episode: episode
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
    this.respond({params: params});
  };

};

exports.Episodes = Episodes;

