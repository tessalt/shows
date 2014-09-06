var Episodes = function () {
  this.respondsWith = ['json'];

  this.index = function (req, resp, params) {
    var self = this;    
    geddy.model.Episode.all(function(err, episodes){
      if (err) {
        throw err;
      }
      var response = {
        episodes: episodes
      }
      self.respond(response);
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
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
    this.respond({params: params});
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

