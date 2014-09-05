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
    return this.store.find('show', params.show_id);
  }
});

App.Show = DS.Model.extend({
  title: DS.attr('string'),
  tvdbId: DS.attr('number')
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

App.ShowsNewController = Ember.Controller.extend({
  results: [],
  loading: false,
  selectedShow: '',
  episodes: [],
  actions: {
    createShow: function() {
      var title = this.get('newTitle');
      var tvdbId = this.get('newTvdbId');
      if (!title) { return false; }
      if (!title.trim()) { return; }
      var show = this.store.createRecord('show', {
        title: title,
        tvdbId: tvdbId
      });
      this.set('newTitle', '');
      this.set('newTvdbId', '');
      show.save().then(function(){
        this.transitionToRoute('show', show);
      }.bind(this));
    },
    searchShows: function() {
      var self = this;
      var query = this.get('searchString');
      this.set('loading', true);
      this.store.find('externalShow', {query: query}).then(function(results){
        self.set('loading', false);
        self.set('results', results.content);
      });
    },
    getEpisodes: function(seriesId) {
      var self = this;
      this.set('selectedShow', seriesId);
      this.set('results', []);
      this.set('loading', true);
      this.store.find('externalEpisode', {id: this.selectedShow.id}).then(function(results){
        self.set('loading', false);
        self.set('episodes', results.content);
      });
    },
    createShow: function() {
      
    }
  }
});