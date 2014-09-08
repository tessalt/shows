var App = Ember.Application.create();

App.ApplicationAdapter = DS.RESTAdapter.extend({
  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

App.Router.map(function() {
  this.resource('shows', {path: '/'});
  this.resource('show', {path: 'shows/:show_id'});
  this.resource('shows.new', {path: 'shows/new'});
});

App.ShowsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('show');
  }
});

App.ShowRoute = Ember.Route.extend({
  model: function(params) {
    return {
      show: this.store.find('show', params.show_id),
      episodes: this.store.find('episode', {showId: params.show_id})
    }
  }
});

App.Show = DS.Model.extend({
  title: DS.attr('string'),
  tvdbId: DS.attr('number'),
  episodes: DS.hasMany('episode')
});

App.Episode = DS.Model.extend({
  name: DS.attr('string'),
  showId: DS.attr('number'),
  show: DS.belongsTo('show'),
  votes: DS.hasMany('vote')
});

App.Vote = DS.Model.extend({
  userId: DS.attr('string'),
  episode: DS.belongsTo('episode'),
  episodeId: DS.attr('string'),
  direction: DS.attr('number')
});

App.ExternalShow = DS.Model.extend({
  SeriesName: DS.attr('string')
});

App.ExternalEpisode = DS.Model.extend({
  EpisodeName: DS.attr('string'),
  EpisodeNumber: DS.attr('number'),
  SeasonNumber: DS.attr('number'),
  overview: DS.attr('string')
});

App.ShowsController = Ember.ArrayController.extend({
  actions: {
    deleteShow: function(show) {
      show.deleteRecord();
      show.save();
    }
  }
});

App.EpisodeController = Ember.ObjectController.extend({
  voteCount: function() {
    var votes = this.get('model.votes').content;
    var total = 0;
    for (var i = 0; i < this.get('model.votes.length'); i++) {
      total += parseInt(votes[i].get('direction'));
    }
    return total;
  }.property('model.votes.length'),
  actions: {
    vote: function(direction) {
      var self = this;
      var vote = this.store.createRecord('vote', {
        direction: direction,
        episodeId: self.model.get('id')
      });
      vote.save().then(function(){
        vote.set('episode', self.model);
      });
    }
  }
});

App.ShowsNewController = Ember.Controller.extend({
  results: [],
  loading: false,
  selectedShow: '',
  episodes: [],
  errorMsg: '',
  actions: {
    searchShows: function() {
      var self = this;
      var query = this.get('searchString');
      this.set('loading', true);
      this.store.find('externalShow', {query: query}).then(function(results){
        self.set('loading', false);
        if (results.content.length) {
          self.set('results', results.content);
        } else {
          self.set('results', '');
          self.set('errorMsg', 'No results');
        }
      }, function(error){
        self.set('loading', false);
        self.set('errorMsg', error.statusText);
      });
    },
    getEpisodes: function(selectedSeries) {
      var self = this;
      var series = this.store.createRecord('show', {
        id: selectedSeries.get('id'),
        title: selectedSeries.get('SeriesName'),
        tvdbId: selectedSeries.get('id')
      });
      this.set('selectedShow', series);
      this.set('results', []);
      this.set('loading', true);
      this.store.find('externalEpisode', {id: this.selectedShow.id}).then(function(results){
        self.set('loading', false);
        self.set('episodes', results.content);
      });
    },
    createShow: function() {
      var self = this;
      var promises = [];
      this.selectedShow.save().then(function(){
        self.episodes.forEach(function(item){
          var episode = self.store.createRecord('episode', {
            name: item.get('EpisodeName'),
            showId: self.selectedShow.id
          }, function(error){
            console.log(error);
            self.set('errorMsg', error);
          });
          promises.push(episode.save());
        });
        Ember.RSVP.all(promises).then(function(){
          self.transitionToRoute('show', self.selectedShow.id);
        }, function(error){
          console.log(error);
          self.set('errorMsg', error);
        });
      }, function(error) {
        if (error.status === 403) {
          self.set('errorMsg', 'You must be authenticated to add a new show');
        } else {
          self.set('errorMsg', error.statusText);
        }
      });
    }
  }
});
