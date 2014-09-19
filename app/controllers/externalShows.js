var Tvdb = require('../helpers/tvdb/tvdb'),
    Q = require('q');
    tvdb = new Tvdb('00E0199BDA221061', 'en');

var ExternalShows = function () {
  this.respondsWith = ['json'];

   this.index = function(req, resp, params) {
    var self = this;
    tvdb.search(params.query).then(function(data){
      external_shows = data;
      var response = {
        external_shows: external_shows
      }
      self.respond(response);
    }, function(error){
      self.respond(err);
    });
  }

}

exports.ExternalShows = ExternalShows;
