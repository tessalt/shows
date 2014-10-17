var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

App.Router.map(function() {
  this.resource('shows', {path: '/'});
  this.resource('show', {path: 'shows/:show_id'});
  this.resource('shows.new', {path: 'shows/new/:show_id'});
  this.resource('externalShows', {path: 'externalShows'});
  this.resource('externalShows.search', {path: 'externalShows/search'}, function() {
    this.route('results', {path: ':keyword'});
  });
  this.resource('externalShow', {path: 'externalShows/:show_id'});
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

App.ShowsNewRoute = Ember.Route.extend({
  model: function(params) {
    return $.getJSON('/external_shows/' + params.show_id).then(function (data){
      return {
        show: data.external_show,
        episodes: data.external_episodes
      }
    });
  },
  afterModel: function(data) {
    var self = this;
    this.store.find('show', data.show.id).then(function (show){
      if (show) {
        self.transitionTo('show', show.id);
      }
    })
  }
});

App.ExternalShowsSearchRoute = Ember.Route.extend({
  beforeModel: function() {
    var self = this;
    App.User.get().then(function (user){
      if (!user) {
        self.controllerFor('shows').set('errorMsg', 'Please login');
        self.transitionTo('shows');
      }
    })
  },
  actions: {
    search: function(keyword) {
      this.transitionTo('externalShows.search.results', keyword);
    }
  },
  setupController: function(controller) {
    controller.set('keyword', '');
  }
});

App.ExternalShowsSearchResultsRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('externalShow', {query: params.keyword});
  },
});

App.User = Ember.Object.extend();

App.User.reopenClass({
  get: function() {
    return $.getJSON('/me');
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

App.ExternalShowsSearchController = Ember.Controller.extend({
  keyword: '',
  errorMsg: ''
});

App.ShowsNewController = Ember.ObjectController.extend({
  actions: {
    createShow: function() {
      var self = this;
      try {
        var show = this.store.createRecord('show', {
          title: this.model.show.SeriesName,
          id: this.model.show.id
        });
      } catch (error) {
        console.log(error);
      }
      if (show) {
        show.save().then(function() {
          Ember.RSVP.all(self.model.episodes.map(function(rawEpisode){
            var episode = self.store.createRecord('episode', {
              name: rawEpisode.EpisodeName,
              showId: self.model.show.id
            });
            return episode.save();
          })).then(function(something){
            self.transitionToRoute('show', self.model.show.id);
          })
        }, function(error){
          console.log(error);
        });
      }
    }
  }
});