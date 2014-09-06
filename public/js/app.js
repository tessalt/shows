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
  show: DS.belongsTo('show')
})

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
          });
          promises.push(episode.save());
        });
        Ember.RSVP.all(promises).then(function(){
          self.transitionToRoute('show', self.selectedShow.id);
        }, function(error){
          console.log(error);
        });
      });
    }
  }
});