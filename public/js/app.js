var App = Ember.Application.create();

App.ApplicationAdapter = DS.RESTAdapter.extend();

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

App.ShowsNewController = Ember.Controller.extend({
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
    transitionToShow: function() {

    }
  }
});