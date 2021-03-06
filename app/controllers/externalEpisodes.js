var Tvdb = require('../helpers/tvdb/tvdb'),
    Q = require('q');
    tvdb = new Tvdb('00E0199BDA221061', 'en');

var ExternalEpisodes = function () {
  this.respondsWith = ['json'];

  this.index = function(req, resp, params) {
    var self = this;
    tvdb.getSeries(params.id).then(function(data){
      var response = {
        external_episodes: data.episodes
      }
      self.respond(response);
    });
  }

}

exports.ExternalEpisodes = ExternalEpisodes;
