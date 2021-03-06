App.Router.map(function() {
  this.resource('shows', {path: 'shows'}, function() {
    this.route('new', {path: 'new/:show_id'});
    this.resource('show', {path: ':show_id'}, function() {
      this.resource('episodes');
    });
  });
  this.resource('externalShows', {path: 'externalShows'});
  this.resource('externalShows.search', {path: 'externalShows/search'}, function() {
    this.route('results', {path: ':keyword'});
  });
});

App.ApplicationRoute = Ember.Route.extend({
  setupController: function(controller) {
    App.User.get().then(function(user){
      controller.set('user', user);
    });
  }
});

App.IndexRoute = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('shows');
  }
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

App.EpisodesRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('episode', {showId: this.modelFor('show').id})
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