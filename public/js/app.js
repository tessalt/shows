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
    return new Ember.RSVP.hash({
      shows: this.store.find('show'),
      user: App.User.get()
    })
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

App.User = Ember.Object.extend();

App.User.reopenClass({
  get: function() {
    return $.getJSON('/me').then(function(data){
      return data;
    });
  }
})

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

App.ShowsController = Ember.ObjectController.extend({
  errorMsg: '',
  actions: {
    deleteShow: function(show) {
      var self = this;
      show.deleteRecord();
      show.save().catch(function(error){
        self.set('errorMsg', error.responseText);
      });
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
  searchShows: '',
  actions: {
    clearSearch: function() {
      this.set('results', []);
      this.set('selectedShow', '');
      this.set('episodes', '');
      this.set('searchString', '');
      this.set('errorMsg', '');
    },
    searchShows: function() {
      var self = this;
      var query = this.get('searchString');
      this.set('episodes', []);
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
      var existing = this.store.getById('show', selectedSeries.get('id'));
      if (!existing) {
        var series = this.store.createRecord('show', {
          id: selectedSeries.get('id'),
          title: selectedSeries.get('SeriesName'),
          tvdbId: selectedSeries.get('id')
        });
        this.set('selectedShow', series);
        this.set('loading', true);
        this.store.find('externalEpisode', {id: this.selectedShow.id}).then(function(results){
          self.set('loading', false);
          self.set('episodes', results.content);
        });
      } else {
        this.set('errorMsg', 'Already added');
      }
      this.set('results', []);
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
            self.set('errorMsg', error);
          });
          promises.push(episode.save());
        });
        Ember.RSVP.all(promises).then(function(){
          var show = self.selectedShow;
          self.set('selectedShow', '');
          self.set('searchString', '');
          self.set('episodes', []);
          self.transitionToRoute('show', show.id);
        }, function(error){
          self.set('errorMsg', error);
        });
      }, function(error) {
        console.log(error);
        self.set('errorMsg', error.responseText);
      });
    }
  }
});
