var Tvdb = require('../helpers/tvdb/tvdb'),
    Q = require('q');
    tvdb = new Tvdb('00E0199BDA221061', 'en');

var ExternalShows = function () {
  this.respondsWith = ['json'];

   this.index = function(req, resp, params) {
    var self = this;
    tvdb.search(params.query).then(function(data){
      var response = {
        external_shows: data
      }
      self.respond(response);
    });
  }
  
}

exports.ExternalShows = ExternalShows;
