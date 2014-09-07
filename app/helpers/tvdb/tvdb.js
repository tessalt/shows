var request = require('request'),
    parseXML = require("xml2js").parseString,
    Q = require('q');

var Tvdb = function(key, lang) {
  this.key = key;
  this.lang = lang;
  this.baseURL = 'http://www.thetvdb.com/api/';
};

Tvdb.prototype.search = function(string) {
  var deferred = Q.defer();
  if (string) {
    var url = this.baseURL + 'GetSeries.php?seriesname=' + string + '&language=' + this.lang;
  } else {
    var url = this.baseURL + 'GetSeries.php?language=' + this.lang;
  }
  request.get(url, function(err, response){
    parseXML(response.body, {
      trim: true,
      normalize: true,
      ignoreAttrs: true,
      explicitArray: false,
      emptyTag: null
    }, function(error, result){
      if (error) {
        deferred.reject(error);
      } else {
        if (result.Data) {
          if (result.Data.Series.seriesid) {
            var series = [];
            series.push(result.Data.Series);
            deferred.resolve(series);
          } else {
            deferred.resolve(result.Data.Series);
          }
        } else {
          deferred.resolve({});
        }
      }
    });
  });
  return deferred.promise;
};

Tvdb.prototype.getSeries = function(seriesId) {
  var deferred = Q.defer();
  var url = this.baseURL + this.key + '/series/' + seriesId + '/all/en.xml';
  request.get(url, function(err, response){
    parseXML(response.body, {
      trim: true,
      normalize: true,
      ignoreAttrs: true,
      explicitArray: false,
      emptyTag: null
    }, function(error, result){
      if (result) {
        deferred.resolve({
          id: result.Data.Series.id,
          name: result.Data.Series.SeriesName,
          episodes: result.Data.Episode
        });
      } else {
        deferred.reject(error);
      }
    });
  });
  return deferred.promise;
};

module.exports = Tvdb;