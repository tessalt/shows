App.ShowsView = Ember.View.extend({
  template: Ember.TEMPLATES.shows
});

App.ShowsIndexView = Ember.View.extend({
  template: Ember.TEMPLATES.shows.index
});

App.ShowsNewView = Ember.View.extend({
  template: Ember.TEMPLATES.shows.new
});

App.ShowsShowView = Ember.View.extend({
  template: Ember.TEMPLATES.shows.show
});

App.ExternalShowsSearchView = Ember.View.extend({
  template: Ember.TEMPLATES.externalShows.search
});

App.ExternalShowsSearchResultsView = Ember.View.extend({
  template: Ember.TEMPLATES.externalShows.search.results
});

App.LoadingView = Ember.View.extend({
  template: Ember.TEMPLATES.loading
});